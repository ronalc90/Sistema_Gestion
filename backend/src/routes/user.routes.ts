import { Router } from 'express';
import * as ctrl from '../controllers/user.controller';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Métricas (solo ADMIN_TOTAL) - debe ir antes de /:id
router.get('/metrics', requireRole('ADMIN_TOTAL'), ctrl.getMetrics);

// CRUD de usuarios
router.get('/', requireRole('ADMIN_TOTAL', 'ADMIN'), ctrl.getUsers);
router.post('/', requireRole('ADMIN_TOTAL'), ctrl.createUser);
router.get('/:id', requireRole('ADMIN_TOTAL', 'ADMIN'), ctrl.getUserById);
router.put('/:id', requireRole('ADMIN_TOTAL'), ctrl.updateUser);
router.delete('/:id', requireRole('ADMIN_TOTAL'), ctrl.deleteUser);
router.put('/:id/status', requireRole('ADMIN_TOTAL'), ctrl.updateStatus);

export default router;
