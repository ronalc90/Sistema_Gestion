/**
 * Controlador de Planificaciones
 * CRUD de planificaciones
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

/**
 * GET /api/planificaciones
 * Listar planificaciones
 */
export const getPlanificaciones = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const 
      empleadoId = req.query.empleadoId as string;
    const contratistaId = req.query.contratistaId as string;
    const estado = req.query.estado as string;
    const fechaDesde = req.query.fechaDesde as string;
    const fechaHasta = req.query.fechaHasta as string;

    const where: Record<string, unknown> = {};
    
    if (empleadoId) where.empleadoId = empleadoId;
    if (contratistaId) where.contratistaId = contratistaId;
    if (estado) where.estado = estado;
    
    if (fechaDesde || fechaHasta) {
      where.fecha = {};
      if (fechaDesde) (where.fecha as Record<string, Date>).gte = new Date(fechaDesde);
      if (fechaHasta) (where.fecha as Record<string, Date>).lte = new Date(fechaHasta);
    }

    const [planificaciones, total] = await Promise.all([
      prisma.planificacion.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fecha: 'desc' },
        include: {
          creador: {
            select: { id: true, nombre: true, email: true },
          },
          empleado: {
            select: { id: true, nombres: true, apellidos: true },
          },
          contratista: {
            select: { id: true, nombre: true },
          },
          actividad: {
            select: { id: true, codigo: true, nombre: true },
          },
          destino: {
            select: { id: true, nombre: true },
          },
        },
      }),
      prisma.planificacion.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Planificaciones obtenidas exitosamente',
      data: planificaciones,
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
 * GET /api/planificaciones/:id
 * Obtener planificación por ID
 */
export const getPlanificacionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const planificacion = await prisma.planificacion.findUnique({
      where: { id },
      include: {
        creador: {
          select: { id: true, nombre: true, email: true },
        },
        empleado: true,
        contratista: true,
        actividad: true,
        destino: true,
      },
    });

    if (!planificacion) {
      res.status(404).json({
        success: false,
        message: 'Planificación no encontrada',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Planificación obtenida exitosamente',
      data: planificacion,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/planificaciones
 * Crear nueva planificación
 */
export const createPlanificacion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      fecha,
      descripcion,
      estado,
      horaInicio,
      horaFin,
      observaciones,
      empleadoId,
      contratistaId,
      actividadId,
      destinoId,
    } = req.body;

    const planificacion = await prisma.planificacion.create({
      data: {
        fecha: new Date(fecha),
        descripcion,
        estado: estado || 'PENDIENTE',
        horaInicio: horaInicio ? new Date(horaInicio) : null,
        horaFin: horaFin ? new Date(horaFin) : null,
        observaciones,
        creadorId: req.user!.id,
        empleadoId,
        contratistaId,
        actividadId,
        destinoId,
      },
      include: {
        creador: { select: { id: true, nombre: true } },
        empleado: { select: { id: true, nombres: true, apellidos: true } },
        contratista: { select: { id: true, nombre: true } },
        actividad: { select: { id: true, nombre: true } },
        destino: { select: { id: true, nombre: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Planificación creada exitosamente',
      data: planificacion,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/planificaciones/:id
 * Actualizar planificación
 */
export const updatePlanificacion = async (
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

    const planificacion = await prisma.planificacion.update({
      where: { id },
      data,
      include: {
        creador: { select: { id: true, nombre: true } },
        empleado: { select: { id: true, nombres: true, apellidos: true } },
        contratista: { select: { id: true, nombre: true } },
        actividad: { select: { id: true, nombre: true } },
        destino: { select: { id: true, nombre: true } },
      },
    });

    res.json({
      success: true,
      message: 'Planificación actualizada exitosamente',
      data: planificacion,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/planificaciones/:id
 * Eliminar planificación
 */
export const deletePlanificacion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.planificacion.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Planificación eliminada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/planificaciones/:id/estado
 * Cambiar estado de planificación
 */
export const updateEstado = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const planificacion = await prisma.planificacion.update({
      where: { id },
      data: { estado },
      include: {
        creador: { select: { id: true, nombre: true } },
        empleado: { select: { id: true, nombres: true, apellidos: true } },
        contratista: { select: { id: true, nombre: true } },
        actividad: { select: { id: true, nombre: true } },
        destino: { select: { id: true, nombre: true } },
      },
    });

    res.json({
      success: true,
      message: 'Estado actualizado exitosamente',
      data: planificacion,
    });
  } catch (error) {
    next(error);
  }
};
