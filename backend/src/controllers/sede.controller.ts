/**
 * Controlador de Sedes
 * CRUD de sedes empresariales con horarios por día
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

/**
 * GET /api/sedes
 * Listar sedes con paginación y búsqueda
 */
export const getSedes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        { nombreColeccion: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (estado) where.estado = estado;

    const [sedes, total] = await Promise.all([
      prisma.sede.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nombre: 'asc' },
        include: {
          centroCosto: { select: { id: true, nombre: true, codigo: true } },
          _count: { select: { empleados: true } },
        },
      }),
      prisma.sede.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Sedes obtenidas exitosamente',
      data: sedes,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/sedes/all
 * Obtener todas las sedes sin paginación
 */
export const getAllSedes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const estado = req.query.estado as string;
    const where = estado ? { estado } : {};

    const sedes = await prisma.sede.findMany({
      where,
      orderBy: { nombre: 'asc' },
      select: { id: true, nombre: true, estado: true },
    });

    res.json({ success: true, data: sedes });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/sedes/:id
 */
export const getSedeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const sede = await prisma.sede.findUnique({
      where: { id },
      include: {
        centroCosto: true,
        horarios: { orderBy: { dia: 'asc' } },
        _count: { select: { empleados: true, destinos: true } },
      },
    });

    if (!sede) {
      res.status(404).json({ success: false, message: 'Sede no encontrada' });
      return;
    }

    res.json({ success: true, data: sede });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/sedes
 */
export const createSede = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nombre, estado, tiempoDescanso, fechaInicial, fechaFinal, nombreColeccion, centroCostoId, horarios } = req.body;

    const sede = await prisma.sede.create({
      data: {
        nombre,
        estado: estado || 'ACTIVO',
        tiempoDescanso,
        fechaInicial: fechaInicial ? new Date(fechaInicial) : null,
        fechaFinal: fechaFinal ? new Date(fechaFinal) : null,
        nombreColeccion,
        centroCostoId: centroCostoId || null,
        horarios: {
          create: DIAS.map((dia) => {
            const h = horarios?.find((x: { dia: string }) => x.dia === dia);
            return {
              dia,
              activo: h?.activo ?? false,
              horaInicio: h?.horaInicio ?? null,
              horaFin: h?.horaFin ?? null,
            };
          }),
        },
      },
      include: {
        centroCosto: true,
        horarios: { orderBy: { dia: 'asc' } },
      },
    });

    res.status(201).json({ success: true, message: 'Sede creada exitosamente', data: sede });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/sedes/:id
 */
export const updateSede = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, estado, tiempoDescanso, fechaInicial, fechaFinal, nombreColeccion, centroCostoId, horarios } = req.body;

    const sede = await prisma.sede.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(estado && { estado }),
        ...(tiempoDescanso !== undefined && { tiempoDescanso }),
        ...(fechaInicial !== undefined && { fechaInicial: fechaInicial ? new Date(fechaInicial) : null }),
        ...(fechaFinal !== undefined && { fechaFinal: fechaFinal ? new Date(fechaFinal) : null }),
        ...(nombreColeccion !== undefined && { nombreColeccion }),
        ...(centroCostoId !== undefined && { centroCostoId: centroCostoId || null }),
        ...(horarios && {
          horarios: {
            upsert: horarios.map((h: { dia: string; activo: boolean; horaInicio?: string; horaFin?: string }) => ({
              where: { sedeId_dia: { sedeId: id, dia: h.dia } },
              update: { activo: h.activo, horaInicio: h.horaInicio ?? null, horaFin: h.horaFin ?? null },
              create: { dia: h.dia, activo: h.activo, horaInicio: h.horaInicio ?? null, horaFin: h.horaFin ?? null },
            })),
          },
        }),
      },
      include: {
        centroCosto: true,
        horarios: { orderBy: { dia: 'asc' } },
      },
    });

    res.json({ success: true, message: 'Sede actualizada exitosamente', data: sede });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/sedes/:id
 */
export const deleteSede = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const sede = await prisma.sede.findUnique({
      where: { id },
      include: { _count: { select: { empleados: true } } },
    });

    if (!sede) {
      res.status(404).json({ success: false, message: 'Sede no encontrada' });
      return;
    }

    if (sede._count.empleados > 0) {
      res.status(400).json({
        success: false,
        message: 'No se puede eliminar la sede porque tiene empleados asociados',
      });
      return;
    }

    await prisma.sede.delete({ where: { id } });

    res.json({ success: true, message: 'Sede eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
};
