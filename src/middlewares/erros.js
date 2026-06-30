export function rotaNaoEncontrada(req, res) {
  res.status(404).json({ erro: `Rota ${req.method} ${req.path} não existe` });
}

export function tratarErro(erro, req, res, _next) {
  console.error(erro);

  // Nunca expõe o stack trace pro cliente em produção
  const emProducao = process.env.NODE_ENV === 'production';
  res.status(500).json({
    erro: 'Erro interno do servidor',
    ...(emProducao ? {} : { detalhe: erro.message }),
  });
}
