import * as modelo from '../models/chamadoModel.js';
import { validarNovoChamado, validarStatus } from '../utils/validacao.js';

export function listar(req, res, next) {
  try {
    const { status, prioridade, busca, ordenar } = req.query;
    const resultado = modelo.listarChamados({ status, prioridade, busca, ordenar });
    res.json(resultado);
  } catch (erro) {
    next(erro);
  }
}

export function buscarUm(req, res, next) {
  try {
    const chamado = modelo.buscarChamadoPorId(Number(req.params.id));
    if (!chamado) return res.status(404).json({ erro: 'Chamado não encontrado' });
    res.json(chamado);
  } catch (erro) {
    next(erro);
  }
}

export function criar(req, res, next) {
  try {
    const erros = validarNovoChamado(req.body);
    if (erros.length) return res.status(400).json({ erro: 'Dados inválidos', detalhes: erros });

    const chamado = modelo.criarChamado(req.body);
    res.status(201).json(chamado);
  } catch (erro) {
    next(erro);
  }
}

export function atualizarStatus(req, res, next) {
  try {
    const erroStatus = validarStatus(req.body.status);
    if (erroStatus) return res.status(400).json({ erro: erroStatus });

    const chamado = modelo.atualizarStatus(Number(req.params.id), req.body.status);
    if (!chamado) return res.status(404).json({ erro: 'Chamado não encontrado' });

    res.json(chamado);
  } catch (erro) {
    next(erro);
  }
}

export function deletar(req, res, next) {
  try {
    const deletado = modelo.deletarChamado(Number(req.params.id));
    if (!deletado) return res.status(404).json({ erro: 'Chamado não encontrado' });
    res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}
