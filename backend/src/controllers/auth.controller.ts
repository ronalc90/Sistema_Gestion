/**
 * Controlador de Autenticación
 * Maneja login, registro y gestión de sesiones
 */

import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, captchaToken } = req.body;
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const result = await authService.login({ email, password, captchaToken, ip, userAgent });

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nombre, email, password, rol } = req.body;
    const result = await authService.register({ nombre, email, password, rol });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Obtener usuario actual
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Usuario obtenido exitosamente',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/change-password
 * Cambiar contraseña
 */
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(userId, currentPassword, newPassword);

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
