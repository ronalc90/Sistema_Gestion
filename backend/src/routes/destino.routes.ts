import { Router } from 'express';
import * as ctrl from '../controllers/destino.controller';

const router = Router();

router.get('/', ctrl.getDestinos);
router.get('/all', ctrl.getAllDestinos);
router.get('/:id', ctrl.getDestinoById);
router.post('/', ctrl.createDestino);
router.put('/:id', ctrl.updateDestino);
router.delete('/:id', ctrl.deleteDestino);

export default router;
