/**
 * Controlador de Centros de Costo
 * CRUD de centros de costo
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

/**
 * GET /api/centros-costo
 * Listar centros de costo
 */
export const getCentrosCosto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;

    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { codigo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [centros, total] = await Promise.all([
      prisma.centroCosto.findMany({
        where,
        skip,
        take: limit,
        orderBy: { codigo: 'asc' },
        include: {
          _count: {
            select: {
              empleados: true,
            },
          },
        },
      }),
      prisma.centroCosto.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Centros de costo obtenidos exitosamente',
      data: centros,
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
 * GET /api/centros-costo/all
 * Obtener todos los centros de costo (sin paginación)
 */
export const getAllCentrosCosto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const centros = await prisma.centroCosto.findMany({
      where: { activo: true },
      orderBy: { codigo: 'asc' },
    });

    res.json({
      success: true,
      message: 'Centros de costo obtenidos exitosamente',
      data: centros,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/centros-costo/:id
 * Obtener centro de costo por ID
 */
export const getCentroCostoById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const centro = await prisma.centroCosto.findUnique({
      where: { id },
      include: {
        empleados: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            cargo: true,
          },
        },
      },
    });

    if (!centro) {
      res.status(404).json({
        success: false,
        message: 'Centro de costo no encontrado',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Centro de costo obtenido exitosamente',
      data: centro,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/centros-costo
 * Crear nuevo centro de costo
 */
export const createCentroCosto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { codigo, nombre, descripcion, presupuesto, activo } = req.body;

    const centro = await prisma.centroCosto.create({
      data: {
        codigo,
        nombre,
        descripcion,
        presupuesto: presupuesto ? parseFloat(presupuesto) : null,
        activo: activo !== undefined ? activo : true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Centro de costo creado exitosamente',
      data: centro,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/centros-costo/:id
 * Actualizar centro de costo
 */
export const updateCentroCosto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { codigo, nombre, descripcion, presupuesto, activo } = req.body;

    const centro = await prisma.centroCosto.update({
      where: { id },
      data: {
        ...(codigo && { codigo }),
        ...(nombre && { nombre }),
        ...(descripcion !== undefined && { descripcion }),
        ...(presupuesto !== undefined && { presupuesto: presupuesto ? parseFloat(presupuesto) : null }),
        ...(activo !== undefined && { activo }),
      },
    });

    res.json({
      success: true,
      message: 'Centro de costo actualizado exitosamente',
      data: centro,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/centros-costo/:id
 * Eliminar centro de costo
 */
export const deleteCentroCosto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Verificar si hay empleados asociados
    const centro = await prisma.centroCosto.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            empleados: true,
          },
        },
      },
    });

    if (centro?._count.empleados) {
      res.status(400).json({
        success: false,
        message: 'No se puede eliminar el centro de costo porque tiene empleados asociados',
      });
      return;
    }

    await prisma.centroCosto.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Centro de costo eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
