/**
 * Controlador de Destinos
 * CRUD de destinos
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

/**
 * GET /api/destinos
 * Listar destinos
 */
export const getDestinos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;
    const sedeId = req.query.sedeId as string;
    const estado = req.query.estado as string;

    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (sedeId) where.sedeId = sedeId;
    if (estado) where.estado = estado;

    const [destinos, total] = await Promise.all([
      prisma.destino.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nombre: 'asc' },
        include: {
          sede: {
            select: { id: true, nombre: true },
          },
        },
      }),
      prisma.destino.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Destinos obtenidos exitosamente',
      data: destinos,
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
 * GET /api/destinos/all
 * Obtener todos los destinos (sin paginación)
 */
export const getAllDestinos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sedeId = req.query.sedeId as string;
    
    const where: Record<string, unknown> = { estado: 'ACTIVO' };
    if (sedeId) where.sedeId = sedeId;

    const destinos = await prisma.destino.findMany({
      where,
      orderBy: { nombre: 'asc' },
      include: {
        sede: {
          select: { id: true, nombre: true },
        },
      },
    });

    res.json({
      success: true,
      message: 'Destinos obtenidos exitosamente',
      data: destinos,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/destinos/:id
 * Obtener destino por ID
 */
export const getDestinoById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const destino = await prisma.destino.findUnique({
      where: { id },
      include: {
        sede: true,
      },
    });

    if (!destino) {
      res.status(404).json({
        success: false,
        message: 'Destino no encontrado',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Destino obtenido exitosamente',
      data: destino,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/destinos
 * Crear nuevo destino
 */
export const createDestino = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nombre, descripcion, sedeId, estado } = req.body;

    const destino = await prisma.destino.create({
      data: {
        nombre,
        descripcion,
        sedeId,
        estado: estado || 'ACTIVO',
      },
      include: {
        sede: {
          select: { id: true, nombre: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Destino creado exitosamente',
      data: destino,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/destinos/:id
 * Actualizar destino
 */
export const updateDestino = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, sedeId, estado } = req.body;

    const destino = await prisma.destino.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(descripcion !== undefined && { descripcion }),
        ...(sedeId && { sedeId }),
        ...(estado && { estado }),
      },
      include: {
        sede: {
          select: { id: true, nombre: true },
        },
      },
    });

    res.json({
      success: true,
      message: 'Destino actualizado exitosamente',
      data: destino,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/destinos/:id
 * Eliminar destino
 */
export const deleteDestino = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.destino.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Destino eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
