const CATEGORIAS = ['hardware', 'software', 'rede', 'acesso', 'outro'];
const PRIORIDADES = ['baixa', 'media', 'alta'];
const STATUS = ['pendente', 'em_andamento', 'concluido'];

export function validarNovoChamado(dados) {
  const erros = [];

  if (!dados.solicitante?.trim()) erros.push('solicitante é obrigatório');
  else if (dados.solicitante.trim().length > 100) erros.push('solicitante deve ter até 100 caracteres');

  if (!dados.titulo?.trim()) erros.push('titulo é obrigatório');
  else if (dados.titulo.trim().length > 150) erros.push('titulo deve ter até 150 caracteres');

  if (!dados.descricao?.trim()) erros.push('descricao é obrigatória');
  else if (dados.descricao.trim().length > 2000) erros.push('descricao deve ter até 2000 caracteres');

  if (!dados.categoria) erros.push('categoria é obrigatória');
  else if (!CATEGORIAS.includes(dados.categoria)) erros.push(`categoria deve ser: ${CATEGORIAS.join(', ')}`);

  if (!dados.prioridade) erros.push('prioridade é obrigatória');
  else if (!PRIORIDADES.includes(dados.prioridade)) erros.push(`prioridade deve ser: ${PRIORIDADES.join(', ')}`);

  return erros;
}

export function validarStatus(novoStatus) {
  if (!novoStatus) return 'status é obrigatório';
  if (!STATUS.includes(novoStatus)) return `status deve ser: ${STATUS.join(', ')}`;
  return null;
}
