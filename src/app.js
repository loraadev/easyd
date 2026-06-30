import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chamadoRoutes from './routes/chamadoRoutes.js';
import { tratarErro, rotaNaoEncontrada } from './middlewares/erros.js';

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

// helmet já aplica vários cabeçalhos de segurança por padrão;
// o CSP aqui nega qualquer script externo — só scripts do próprio site passam
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
      },
    },
  })
);

// 100 requisições por 15 minutos por IP — suficiente pra uso normal,
// mas impede flood de bots ou scripts desgovernados
const limitador = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas requisições. Tente novamente em alguns minutos.' },
});
app.use('/api', limitador);

// 10kb é mais que suficiente pra um chamado; rejeita payloads gigantes
app.use(express.json({ limit: '10kb' }));

app.use(express.static(join(__dirname, '..', 'public')));

app.use('/api', chamadoRoutes);

app.use(rotaNaoEncontrada);
app.use(tratarErro);

export default app;
