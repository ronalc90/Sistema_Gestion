/**
 * Middleware temporal de desarrollo
 * Inyecta el usuario admin en req.user cuando no hay autenticación JWT activa
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

export const devAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    const admin = await prisma.user.findFirst({
      where: { email: 'admin@empresa.com' },
    });
    if (admin) {
      req.user = admin;
    }
  }
  next();
};
