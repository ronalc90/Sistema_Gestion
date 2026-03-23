/**
 * Tipos compartidos del aplicación
 */

import { Request } from 'express';
import { User, RolUsuario } from '@prisma/client';

// Usuario sin contraseña para respuestas
export type UserWithoutPassword = Omit<User, 'password'>;

// Extensión del Request de Express para incluir usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: UserWithoutPassword;
    }
  }
}

// Respuesta estándar de la API
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Payload del JWT
export interface JWTPayload {
  userId: string;
  email: string;
  rol: RolUsuario;
  iat?: number;
  exp?: number;
}

// Opciones de paginación
export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

// Filtros de búsqueda
export interface SearchFilters {
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  startDate?: Date;
  endDate?: Date;
  [key: string]: unknown;
}
