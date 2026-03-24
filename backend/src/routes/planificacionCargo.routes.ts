import { Router } from 'express';
import * as ctrl from '../controllers/planificacionCargo.controller';

const router = Router();

router.get('/', ctrl.getPlanificacionesCargos);
router.post('/bulk', ctrl.bulkCreatePlanificacionesCargos);
router.get('/:id', ctrl.getPlanificacionCargoById);
router.post('/', ctrl.createPlanificacionCargo);
router.put('/:id', ctrl.updatePlanificacionCargo);
router.delete('/:id', ctrl.deletePlanificacionCargo);

export default router;
