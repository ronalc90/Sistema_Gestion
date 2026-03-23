import { Router } from 'express';
import * as ctrl from '../controllers/contratista.controller';

const router = Router();

router.get('/', ctrl.getContratistas);
router.get('/all', ctrl.getAllContratistas);
router.get('/:id', ctrl.getContratistaById);
router.post('/', ctrl.createContratista);
router.put('/:id', ctrl.updateContratista);
router.delete('/:id', ctrl.deleteContratista);

export default router;
