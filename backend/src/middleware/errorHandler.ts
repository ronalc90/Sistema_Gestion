/**
 * Middleware global de manejo de errores
 * Captura y formatea todos los errores de la aplicación
 */

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { env } from '../config/env';

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  meta?: unknown;
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  // Error de Prisma - Registro único violado
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ');
      res.status(409).json({
        success: false,
        message: `Ya existe un registro con ese ${target || 'valor'}`,
        error: 'DUPLICATE_ENTRY',
      });
      return;
    }

    // Registro no encontrado
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Registro no encontrado',
        error: 'NOT_FOUND',
      });
      return;
    }

    // Violación de clave foránea
    if (err.code === 'P2003') {
      res.status(400).json({
        success: false,
        message: 'Referencia inválida. El registro relacionado no existe.',
        error: 'FOREIGN_KEY_VIOLATION',
      });
      return;
    }
  }

  // Error de validación de Prisma
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: 'Datos inválidos',
      error: env.NODE_ENV === 'development' ? err.message : 'VALIDATION_ERROR',
    });
    return;
  }

  // Error con código de estado personalizado
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    message,
    error: env.NODE_ENV === 'development' ? err.stack : 'INTERNAL_ERROR',
  });
};

// Handler para rutas no encontradas
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    error: 'ROUTE_NOT_FOUND',
  });
};
