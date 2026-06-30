import { Router } from 'express';
import * as controller from '../controllers/chamadoController.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));

router.get('/chamados', controller.listar);
router.get('/chamados/:id', controller.buscarUm);
router.post('/chamados', controller.criar);
router.patch('/chamados/:id/status', controller.atualizarStatus);
router.delete('/chamados/:id', controller.deletar);

export default router;
