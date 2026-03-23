import { Router } from 'express';
import * as ctrl from '../controllers/centro-costo.controller';

const router = Router();

router.get('/', ctrl.getCentrosCosto);
router.get('/all', ctrl.getAllCentrosCosto);
router.get('/:id', ctrl.getCentroCostoById);
router.post('/', ctrl.createCentroCosto);
router.put('/:id', ctrl.updateCentroCosto);
router.delete('/:id', ctrl.deleteCentroCosto);

export default router;
