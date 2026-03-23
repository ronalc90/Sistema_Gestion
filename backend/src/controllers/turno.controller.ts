/**
 * Controlador de Turnos
 * CRUD de turnos
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

/**
 * GET /api/turnos
 * Listar turnos
 */
export const getTurnos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const empleadoId = req.query.empleadoId as string;
    const estado = req.query.estado as string;
    const fechaDesde = req.query.fechaDesde as string;
    const fechaHasta = req.query.fechaHasta as string;

    const where: Record<string, unknown> = {};
    
    if (empleadoId) where.empleadoId = empleadoId;
    if (estado) where.estado = estado;
    
    if (fechaDesde || fechaHasta) {
      where.fecha = {};
      if (fechaDesde) (where.fecha as Record<string, Date>).gte = new Date(fechaDesde);
      if (fechaHasta) (where.fecha as Record<string, Date>).lte = new Date(fechaHasta);
    }

    const [turnos, total] = await Promise.all([
      prisma.turno.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fecha: 'desc' },
        include: {
          empleado: {
            select: { id: true, nombres: true, apellidos: true, cargo: true },
          },
        },
      }),
      prisma.turno.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Turnos obtenidos exitosamente',
      data: turnos,
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
 * GET /api/turnos/:id
 * Obtener turno por ID
 */
export const getTurnoById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const turno = await prisma.turno.findUnique({
      where: { id },
      include: {
        empleado: true,
      },
    });

    if (!turno) {
      res.status(404).json({
        success: false,
        message: 'Turno no encontrado',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Turno obtenido exitosamente',
      data: turno,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/turnos
 * Crear nuevo turno
 */
export const createTurno = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fecha, tipo, horaInicio, horaFin, estado, observaciones, empleadoId } = req.body;

    const turno = await prisma.turno.create({
      data: {
        fecha: new Date(fecha),
        tipo: tipo || 'DIURNO',
        horaInicio: new Date(horaInicio),
        horaFin: new Date(horaFin),
        estado: estado || 'PROGRAMADO',
        observaciones,
        empleadoId,
      },
      include: {
        empleado: { select: { id: true, nombres: true, apellidos: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Turno creado exitosamente',
      data: turno,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/turnos/:id
 * Actualizar turno
 */
export const updateTurno = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Convertir fechas si existen
    if (data.fecha) data.fecha = new Date(data.fecha);
    if (data.horaInicio) data.horaInicio = new Date(data.horaInicio);
    if (data.horaFin) data.horaFin = new Date(data.horaFin);

    const turno = await prisma.turno.update({
      where: { id },
      data,
      include: {
        empleado: { select: { id: true, nombres: true, apellidos: true } },
      },
    });

    res.json({
      success: true,
      message: 'Turno actualizado exitosamente',
      data: turno,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/turnos/:id
 * Eliminar turno
 */
export const deleteTurno = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.turno.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Turno eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/turnos/:id/estado
 * Cambiar estado del turno
 */
export const updateEstado = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const turno = await prisma.turno.update({
      where: { id },
      data: { estado },
      include: {
        empleado: { select: { id: true, nombres: true, apellidos: true } },
      },
    });

    res.json({
      success: true,
      message: 'Estado actualizado exitosamente',
      data: turno,
    });
  } catch (error) {
    next(error);
  }
};
