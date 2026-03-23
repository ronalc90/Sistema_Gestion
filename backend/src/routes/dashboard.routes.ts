import { Router } from 'express';
import * as ctrl from '../services/dashboard.service';
import { Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await ctrl.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

router.get('/charts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const charts = await ctrl.getChartData();
    res.json({ success: true, data: charts });
  } catch (error) {
    next(error);
  }
});

export default router;
