import { Router } from 'express';
import * as ctrl from '../controllers/planificacion.controller';

const router = Router();

router.get('/', ctrl.getPlanificaciones);
router.get('/:id', ctrl.getPlanificacionById);
router.post('/', ctrl.createPlanificacion);
router.put('/:id', ctrl.updatePlanificacion);
router.delete('/:id', ctrl.deletePlanificacion);
router.patch('/:id/estado', ctrl.updateEstado);

export default router;
