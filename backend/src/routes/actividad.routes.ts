import { Router } from 'express';
import * as ctrl from '../controllers/actividad.controller';

const router = Router();

router.get('/', ctrl.getActividades);
router.get('/all', ctrl.getAllActividades);
router.get('/:id', ctrl.getActividadById);
router.post('/', ctrl.createActividad);
router.put('/:id', ctrl.updateActividad);
router.delete('/:id', ctrl.deleteActividad);

export default router;
