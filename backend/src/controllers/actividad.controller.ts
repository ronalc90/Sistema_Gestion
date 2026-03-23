/**
 * Controlador de Actividades
 * CRUD de actividades
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

/**
 * GET /api/actividades
 * Listar actividades
 */
export const getActividades = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;
    const activo = req.query.activo as string;

    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { codigo: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (activo !== undefined) {
      where.activo = activo === 'true';
    }

    const [actividades, total] = await Promise.all([
      prisma.actividad.findMany({
        where,
        skip,
        take: limit,
        orderBy: { codigo: 'asc' },
      }),
      prisma.actividad.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Actividades obtenidas exitosamente',
      data: actividades,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/actividades/all
 * Obtener todas las actividades (sin paginación)
 */
export const getAllActividades = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const actividades = await prisma.actividad.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });

    res.json({
      success: true,
      message: 'Actividades obtenidas exitosamente',
      data: actividades,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/actividades/:id
 * Obtener actividad por ID
 */
export const getActividadById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const actividad = await prisma.actividad.findUnique({
      where: { id },
    });

    if (!actividad) {
      res.status(404).json({
        success: false,
        message: 'Actividad no encontrada',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Actividad obtenida exitosamente',
      data: actividad,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/actividades
 * Crear nueva actividad
 */
export const createActividad = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { codigo, nombre, descripcion, activo } = req.body;

    const actividad = await prisma.actividad.create({
      data: {
        codigo,
        nombre,
        descripcion,
        activo: activo !== undefined ? activo : true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Actividad creada exitosamente',
      data: actividad,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/actividades/:id
 * Actualizar actividad
 */
export const updateActividad = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { codigo, nombre, descripcion, activo } = req.body;

    const actividad = await prisma.actividad.update({
      where: { id },
      data: {
        ...(codigo && { codigo }),
        ...(nombre && { nombre }),
        ...(descripcion !== undefined && { descripcion }),
        ...(activo !== undefined && { activo }),
      },
    });

    res.json({
      success: true,
      message: 'Actividad actualizada exitosamente',
      data: actividad,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/actividades/:id
 * Eliminar actividad
 */
export const deleteActividad = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.actividad.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Actividad eliminada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
