import { Router } from 'express';
import * as ctrl from '../controllers/empleado.controller';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/all', ctrl.getAllEmpleados);
router.get('/', ctrl.getEmpleados);
router.get('/:id', ctrl.getEmpleadoById);
router.post('/', ctrl.createEmpleado);
router.post('/bulk-create', upload.single('file'), ctrl.createBulkEmpleados);
router.put('/bulk-update', ctrl.updateBulkEmpleados);
router.put('/:id', ctrl.updateEmpleado);
router.delete('/:id', ctrl.deleteEmpleado);

export default router;
