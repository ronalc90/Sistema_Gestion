/**
 * Controlador de Visitantes
 * CRUD de visitantes y control de acceso
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

/**
 * GET /api/visitantes
 * Listar visitantes
 */
export const getVisitantes = async (
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
    const tipo = req.query.tipo as string;

    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { identificacion: { contains: search, mode: 'insensitive' } },
        { empresa: { contains: search, mode: 'insensitive' } },
        { motivo: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (sedeId) where.sedeId = sedeId;
    if (estado) where.estado = estado;
    if (tipo) where.tipo = tipo;

    const [visitantes, total] = await Promise.all([
      prisma.visitante.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fechaEntrada: 'desc' },
        include: {
          sede: {
            select: { id: true, nombre: true },
          },
          registradoPor: {
            select: { id: true, nombre: true },
          },
        },
      }),
      prisma.visitante.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Visitantes obtenidos exitosamente',
      data: visitantes,
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
 * GET /api/visitantes/activos
 * Listar visitantes actualmente en sitio
 */
export const getVisitantesActivos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sedeId = req.query.sedeId as string;

    const where: Record<string, unknown> = { estado: 'EN_SITIO' };
    if (sedeId) where.sedeId = sedeId;

    const visitantes = await prisma.visitante.findMany({
      where,
      orderBy: { fechaEntrada: 'desc' },
      include: {
        sede: {
          select: { id: true, nombre: true },
        },
        registradoPor: {
          select: { id: true, nombre: true },
        },
      },
    });

    res.json({
      success: true,
      message: 'Visitantes activos obtenidos exitosamente',
      data: visitantes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/visitantes/:id
 * Obtener visitante por ID
 */
export const getVisitanteById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const visitante = await prisma.visitante.findUnique({
      where: { id },
      include: {
        sede: true,
        registradoPor: {
          select: { id: true, nombre: true, email: true },
        },
      },
    });

    if (!visitante) {
      res.status(404).json({
        success: false,
        message: 'Visitante no encontrado',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Visitante obtenido exitosamente',
      data: visitante,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/visitantes
 * Registrar nueva visita
 */
export const createVisitante = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      tipo,
      nombre,
      identificacion,
      empresa,
      telefono,
      email,
      motivo,
      sedeId,
      observaciones,
    } = req.body;

    const visitante = await prisma.visitante.create({
      data: {
        tipo: tipo || 'PERSONAL',
        nombre,
        identificacion,
        empresa,
        telefono,
        email,
        motivo,
        sedeId,
        registradoPorId: req.user!.id,
        observaciones,
        estado: 'EN_SITIO',
      },
      include: {
        sede: { select: { id: true, nombre: true } },
        registradoPor: { select: { id: true, nombre: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Visitante registrado exitosamente',
      data: visitante,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/visitantes/:id
 * Actualizar visitante
 */
export const updateVisitante = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    const visitante = await prisma.visitante.update({
      where: { id },
      data,
      include: {
        sede: { select: { id: true, nombre: true } },
        registradoPor: { select: { id: true, nombre: true } },
      },
    });

    res.json({
      success: true,
      message: 'Visitante actualizado exitosamente',
      data: visitante,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/visitantes/:id/salida
 * Registrar salida de visitante
 */
export const registrarSalida = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const visitante = await prisma.visitante.update({
      where: { id },
      data: {
        fechaSalida: new Date(),
        estado: 'FINALIZADA',
      },
      include: {
        sede: { select: { id: true, nombre: true } },
        registradoPor: { select: { id: true, nombre: true } },
      },
    });

    res.json({
      success: true,
      message: 'Salida registrada exitosamente',
      data: visitante,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/visitantes/:id
 * Eliminar registro de visitante
 */
export const deleteVisitante = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.visitante.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Registro de visitante eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
