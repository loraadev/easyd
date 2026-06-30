import * as api from './api.js';
import * as ui from './ui.js';

// Estado dos filtros ativos — centralizado aqui pra qualquer mudança
// num filtro re-usar os outros sem perder o que o usuário escolheu
const filtros = {
  status: '',
  prioridade: '',
  busca: '',
  ordenar: 'criado_em',
};

async function carregarChamados() {
  try {
    const resultado = await api.buscarChamados(filtros);
    ui.atualizarResumo(resultado.resumo);
    ui.renderizarLista(resultado.chamados, avancarStatus, confirmarDelecao);
  } catch (erro) {
    console.error('Erro ao carregar chamados:', erro);
  }
}

async function avancarStatus(id, novoStatus) {
  try {
    await api.atualizarStatus(id, novoStatus);
    await carregarChamados();
  } catch (erro) {
    alert(`Não foi possível atualizar o status: ${erro.message}`);
  }
}

async function confirmarDelecao(id) {
  if (!confirm('Remover este chamado? Esta ação não pode ser desfeita.')) return;
  try {
    await api.deletarChamado(id);
    await carregarChamados();
  } catch (erro) {
    alert(`Não foi possível remover: ${erro.message}`);
  }
}

// ---- formulário ----

document.getElementById('form-chamado').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const form = evento.target;
  const btn = form.querySelector('button[type="submit"]');

  const dados = {
    solicitante: form.solicitante.value,
    titulo:      form.titulo.value,
    descricao:   form.descricao.value,
    categoria:   form.categoria.value,
    prioridade:  form.prioridade.value,
  };

  btn.disabled = true;
  ui.limparMensagemFormulario();

  try {
    await api.criarChamado(dados);
    form.reset();
    ui.exibirMensagemFormulario('Chamado aberto com sucesso!', 'ok');
    await carregarChamados();
  } catch (erro) {
    ui.exibirMensagemFormulario(erro.message, 'erro');
  } finally {
    btn.disabled = false;
  }
});

// ---- filtros ----

// debounce pra não disparar requisição a cada tecla digitada
let temporizadorBusca;
document.getElementById('busca').addEventListener('input', (e) => {
  clearTimeout(temporizadorBusca);
  temporizadorBusca = setTimeout(() => {
    filtros.busca = e.target.value.trim();
    carregarChamados();
  }, 300);
});

document.getElementById('filtro-status').addEventListener('change', (e) => {
  filtros.status = e.target.value;
  carregarChamados();
});

document.getElementById('filtro-prioridade').addEventListener('change', (e) => {
  filtros.prioridade = e.target.value;
  carregarChamados();
});

document.getElementById('ordenar').addEventListener('change', (e) => {
  filtros.ordenar = e.target.value;
  carregarChamados();
});

// ---- início ----
carregarChamados();
