import 'dotenv/config';
import app from './src/app.js';
import { inicializarBanco } from './src/config/database.js';

const PORTA = process.env.PORT || 3000;

// O banco precisa estar pronto antes de aceitar requisições
inicializarBanco();

app.listen(PORTA, () => {
  console.log(`Easyd rodando em http://localhost:${PORTA}`);
});
