import { Router } from 'express';
import * as ctrl from '../controllers/visitante.controller';
import { devAuth } from '../middleware/devAuth';

const router = Router();

router.get('/', ctrl.getVisitantes);
router.get('/:id', ctrl.getVisitanteById);
router.post('/', devAuth, ctrl.createVisitante);
router.put('/:id', ctrl.updateVisitante);
router.delete('/:id', ctrl.deleteVisitante);
router.post('/:id/salida', ctrl.registrarSalida);

export default router;
