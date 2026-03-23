/**
 * Middleware de autenticación y autorización
 * Valida tokens JWT y controla acceso por roles
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import prisma from '../config/database';
import { JWTPayload, UserWithoutPassword } from '../types';
import { RolUsuario } from '@prisma/client';

// Excluir contraseña de las consultas
const userSelect = {
  id: true,
  nombre: true,
  email: true,
  rol: true,
  estado: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Middleware para verificar token JWT
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Acceso denegado. Token no proporcionado.',
      });
      return;
    }

    // Verificar token
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;

    // Obtener usuario de la base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: userSelect,
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Usuario no encontrado.',
      });
      return;
    }

    if (user.estado !== 'ACTIVO') {
      res.status(403).json({
        success: false,
        message: 'Usuario inactivo o bloqueado.',
      });
      return;
    }

    // Adjuntar usuario al request
    req.user = user as UserWithoutPassword;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expirado. Por favor inicie sesión nuevamente.',
      });
      return;
    }
    
    res.status(403).json({
      success: false,
      message: 'Token inválido.',
    });
  }
};

/**
 * Middleware para verificar roles
 * @param roles - Roles permitidos
 */
export const requireRole = (...roles: RolUsuario[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autenticado.',
      });
      return;
    }

    if (!roles.includes(req.user.rol)) {
      res.status(403).json({
        success: false,
        message: 'No tiene permisos para acceder a este recurso.',
      });
      return;
    }

    next();
  };
};

/**
 * Middleware opcional de autenticación
 * No requiere token, pero lo usa si está presente
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: userSelect,
      });
      
      if (user && user.estado === 'ACTIVO') {
        req.user = user as UserWithoutPassword;
      }
    }

    next();
  } catch {
    // Continuar sin usuario si el token es inválido
    next();
  }
};
