/**
 * Controlador de Contratistas
 * CRUD de contratistas
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

/**
 * GET /api/contratistas
 * Listar contratistas
 */
export const getContratistas = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;
    const estado = req.query.estado as string;

    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { nit: { contains: search, mode: 'insensitive' } },
        { representante: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (estado) {
      where.estado = estado;
    }

    const [contratistas, total] = await Promise.all([
      prisma.contratista.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nombre: 'asc' },
        include: {
          _count: {
            select: {
              empleados: true,
            },
          },
        },
      }),
      prisma.contratista.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Contratistas obtenidos exitosamente',
      data: contratistas,
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
 * GET /api/contratistas/all
 * Obtener todos los contratistas (sin paginación)
 */
export const getAllContratistas = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const estado = req.query.estado as string;
    
    const where = estado ? { estado } : {};

    const contratistas = await prisma.contratista.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });

    res.json({
      success: true,
      message: 'Contratistas obtenidos exitosamente',
      data: contratistas,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/contratistas/:id
 * Obtener contratista por ID
 */
export const getContratistaById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const contratista = await prisma.contratista.findUnique({
      where: { id },
      include: {
        empleados: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            cargo: true,
            estado: true,
          },
        },
      },
    });

    if (!contratista) {
      res.status(404).json({
        success: false,
        message: 'Contratista no encontrado',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Contratista obtenido exitosamente',
      data: contratista,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/contratistas
 * Crear nuevo contratista
 */
export const createContratista = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nombre, nit, representante, telefono, email, direccion, estado } = req.body;

    const contratista = await prisma.contratista.create({
      data: {
        nombre,
        nit,
        representante,
        telefono,
        email,
        direccion,
        estado: estado || 'ACTIVO',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Contratista creado exitosamente',
      data: contratista,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/contratistas/:id
 * Actualizar contratista
 */
export const updateContratista = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, nit, representante, telefono, email, direccion, estado } = req.body;

    const contratista = await prisma.contratista.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(nit !== undefined && { nit }),
        ...(representante !== undefined && { representante }),
        ...(telefono !== undefined && { telefono }),
        ...(email !== undefined && { email }),
        ...(direccion !== undefined && { direccion }),
        ...(estado && { estado }),
      },
    });

    res.json({
      success: true,
      message: 'Contratista actualizado exitosamente',
      data: contratista,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/contratistas/:id
 * Eliminar contratista
 */
export const deleteContratista = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Verificar si hay empleados asociados
    const contratista = await prisma.contratista.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            empleados: true,
          },
        },
      },
    });

    if (contratista?._count.empleados) {
      res.status(400).json({
        success: false,
        message: 'No se puede eliminar el contratista porque tiene empleados asociados',
      });
      return;
    }

    await prisma.contratista.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Contratista eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
