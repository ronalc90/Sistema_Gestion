import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/login', ctrl.login);
router.post('/register', ctrl.register);
router.get('/me', authenticateToken, ctrl.getMe);
router.put('/change-password', authenticateToken, ctrl.changePassword);

export default router;
