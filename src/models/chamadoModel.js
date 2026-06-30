import { obterBanco } from '../config/database.js';

export function listarChamados({ status, prioridade, busca, ordenar }) {
  const banco = obterBanco();
  const condicoes = [];
  const parametros = [];

  if (status) {
    condicoes.push('status = ?');
    parametros.push(status);
  }

  if (prioridade) {
    condicoes.push('prioridade = ?');
    parametros.push(prioridade);
  }

  // busca por texto em campos relevantes; LIKE com parâmetro é seguro contra SQL injection
  if (busca) {
    condicoes.push('(titulo LIKE ? OR solicitante LIKE ? OR descricao LIKE ?)');
    const termo = `%${busca}%`;
    parametros.push(termo, termo, termo);
  }

  const clausulaWhere = condicoes.length ? `WHERE ${condicoes.join(' AND ')}` : '';

  // whitelist de colunas ordenáveis — impede que o cliente injete SQL via query string
  const colunasPermitidas = ['criado_em', 'atualizado_em', 'prioridade', 'status', 'titulo'];
  const coluna = colunasPermitidas.includes(ordenar) ? ordenar : 'criado_em';

  const chamados = banco.prepare(
    `SELECT * FROM chamados ${clausulaWhere} ORDER BY ${coluna} DESC`
  ).all(...parametros);

  const resumo = banco.prepare(`
    SELECT
      COUNT(*) FILTER (WHERE status = 'pendente')     AS pendente,
      COUNT(*) FILTER (WHERE status = 'em_andamento') AS em_andamento,
      COUNT(*) FILTER (WHERE status = 'concluido')    AS concluido,
      COUNT(*)                                         AS total
    FROM chamados
  `).get();

  return { chamados, resumo };
}

export function buscarChamadoPorId(id) {
  return obterBanco().prepare('SELECT * FROM chamados WHERE id = ?').get(id);
}

export function criarChamado({ solicitante, titulo, descricao, categoria, prioridade }) {
  const banco = obterBanco();
  const resultado = banco.prepare(`
    INSERT INTO chamados (solicitante, titulo, descricao, categoria, prioridade)
    VALUES (?, ?, ?, ?, ?)
  `).run(solicitante.trim(), titulo.trim(), descricao.trim(), categoria, prioridade);

  return buscarChamadoPorId(resultado.lastInsertRowid);
}

export function atualizarStatus(id, novoStatus) {
  const banco = obterBanco();
  const resultado = banco.prepare(
    'UPDATE chamados SET status = ? WHERE id = ?'
  ).run(novoStatus, id);

  if (resultado.changes === 0) return null;
  return buscarChamadoPorId(id);
}

export function deletarChamado(id) {
  const resultado = obterBanco().prepare('DELETE FROM chamados WHERE id = ?').run(id);
  return resultado.changes > 0;
}
