import { Router } from 'express';
import * as ctrl from '../controllers/sede.controller';

const router = Router();

router.get('/', ctrl.getSedes);
router.get('/all', ctrl.getAllSedes);
router.get('/:id', ctrl.getSedeById);
router.post('/', ctrl.createSede);
router.put('/:id', ctrl.updateSede);
router.delete('/:id', ctrl.deleteSede);

export default router;
