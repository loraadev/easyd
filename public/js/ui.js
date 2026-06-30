// Tudo que toca no DOM fica aqui. Nenhuma função daqui faz fetch.

const ROTULOS_STATUS = {
  pendente:     'Pendente',
  em_andamento: 'Em andamento',
  concluido:    'Concluído',
};

const ROTULOS_PRIORIDADE = {
  alta:  'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

// Qual status vem depois no fluxo pendente → em_andamento → concluido
const PROXIMO_STATUS = {
  pendente:     'em_andamento',
  em_andamento: 'concluido',
};

export function atualizarResumo(resumo) {
  document.getElementById('contador-total').querySelector('.contador-numero').textContent = resumo.total;
  document.getElementById('contador-pendente').querySelector('.contador-numero').textContent = resumo.pendente;
  document.getElementById('contador-andamento').querySelector('.contador-numero').textContent = resumo.em_andamento;
  document.getElementById('contador-concluido').querySelector('.contador-numero').textContent = resumo.concluido;
}

export function renderizarLista(chamados, onAvancar, onDeletar) {
  const container = document.getElementById('lista-chamados');
  container.textContent = ''; // limpa sem innerHTML

  if (!chamados.length) {
    const vazio = document.createElement('p');
    vazio.className = 'estado-vazio';
    vazio.textContent = 'Nenhum chamado encontrado.';
    container.appendChild(vazio);
    return;
  }

  chamados.forEach(chamado => {
    container.appendChild(criarCard(chamado, onAvancar, onDeletar));
  });
}

function criarCard(chamado, onAvancar, onDeletar) {
  const classePorStatus = {
    pendente:     'card--pendente',
    em_andamento: 'card--andamento',
    concluido:    'card--concluido',
  };

  const card = document.createElement('article');
  card.className = `card ${classePorStatus[chamado.status] || ''}`;
  card.dataset.id = chamado.id;

  // --- topo ---
  const topo = document.createElement('div');
  topo.className = 'card-topo';

  const titulo = document.createElement('span');
  titulo.className = 'card-titulo';
  titulo.textContent = chamado.titulo;

  topo.appendChild(titulo);
  card.appendChild(topo);

  // --- solicitante ---
  const solicitante = document.createElement('p');
  solicitante.className = 'card-solicitante';
  solicitante.textContent = `Solicitante: ${chamado.solicitante}`;
  card.appendChild(solicitante);

  // --- descrição ---
  const descricao = document.createElement('p');
  descricao.className = 'card-descricao';
  descricao.textContent = chamado.descricao;
  card.appendChild(descricao);

  // --- selos ---
  const selos = document.createElement('div');
  selos.className = 'selos';
  selos.appendChild(criarSelo(ROTULOS_STATUS[chamado.status], `selo--${chamado.status === 'em_andamento' ? 'andamento' : chamado.status}`));
  selos.appendChild(criarSelo(ROTULOS_PRIORIDADE[chamado.prioridade], `selo--${chamado.prioridade}`));
  selos.appendChild(criarSelo(chamado.categoria, ''));
  card.appendChild(selos);

  // --- rodapé com ações ---
  const rodape = document.createElement('div');
  rodape.className = 'card-rodape';

  const acoes = document.createElement('div');
  acoes.className = 'card-acoes';

  const proximoStatus = PROXIMO_STATUS[chamado.status];
  if (proximoStatus) {
    const btnAvancar = document.createElement('button');
    btnAvancar.className = 'btn btn--status';
    btnAvancar.textContent = `→ ${ROTULOS_STATUS[proximoStatus]}`;
    btnAvancar.addEventListener('click', () => onAvancar(chamado.id, proximoStatus));
    acoes.appendChild(btnAvancar);
  }

  const btnDeletar = document.createElement('button');
  btnDeletar.className = 'btn btn--deletar';
  btnDeletar.textContent = 'Remover';
  btnDeletar.addEventListener('click', () => onDeletar(chamado.id));
  acoes.appendChild(btnDeletar);

  const data = document.createElement('span');
  data.className = 'card-data';
  data.textContent = formatarData(chamado.criado_em);

  rodape.appendChild(acoes);
  rodape.appendChild(data);
  card.appendChild(rodape);

  return card;
}

function criarSelo(texto, classeExtra) {
  const selo = document.createElement('span');
  selo.className = `selo ${classeExtra}`.trim();
  selo.textContent = texto;
  return selo;
}

export function exibirMensagemFormulario(texto, tipo) {
  const el = document.getElementById('msg-formulario');
  el.textContent = texto;
  el.className = `msg-formulario ${tipo}`; // tipo: 'ok' | 'erro'
}

export function limparMensagemFormulario() {
  const el = document.getElementById('msg-formulario');
  el.textContent = '';
  el.className = 'msg-formulario';
}

function formatarData(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}
