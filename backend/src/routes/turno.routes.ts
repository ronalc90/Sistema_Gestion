import { Router } from 'express';
import * as ctrl from '../controllers/turno.controller';

const router = Router();

router.get('/', ctrl.getTurnos);
router.get('/:id', ctrl.getTurnoById);
router.post('/', ctrl.createTurno);
router.put('/:id', ctrl.updateTurno);
router.delete('/:id', ctrl.deleteTurno);

export default router;
