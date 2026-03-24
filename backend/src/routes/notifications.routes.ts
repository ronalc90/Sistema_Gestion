import { Router } from 'express';
import { sendTrabajadorNotification } from '../controllers/notifications.controller';

const router = Router();

router.post('/trabajador', sendTrabajadorNotification);

export default router;
