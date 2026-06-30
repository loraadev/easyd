// Todas as chamadas à API ficam aqui. O resto do front nunca faz fetch diretamente.

const BASE = '/api';

async function requisitar(caminho, opcoes = {}) {
  const resposta = await fetch(`${BASE}${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  });

  // 204 não tem corpo — retornar null evita erro de parse
  if (resposta.status === 204) return null;

  const dados = await resposta.json();

  if (!resposta.ok) {
    const mensagem = dados.erro || 'Erro desconhecido';
    const detalhes = dados.detalhes ? `: ${dados.detalhes.join(', ')}` : '';
    throw new Error(`${mensagem}${detalhes}`);
  }

  return dados;
}

export function buscarChamados(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.status)     params.set('status', filtros.status);
  if (filtros.prioridade) params.set('prioridade', filtros.prioridade);
  if (filtros.busca)      params.set('busca', filtros.busca);
  if (filtros.ordenar)    params.set('ordenar', filtros.ordenar);

  const qs = params.toString();
  return requisitar(`/chamados${qs ? '?' + qs : ''}`);
}

export function criarChamado(dados) {
  return requisitar('/chamados', { method: 'POST', body: JSON.stringify(dados) });
}

export function atualizarStatus(id, novoStatus) {
  return requisitar(`/chamados/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: novoStatus }),
  });
}

export function deletarChamado(id) {
  return requisitar(`/chamados/${id}`, { method: 'DELETE' });
}
