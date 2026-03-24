import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

export const getPlanificacionesCargos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { cargo: { contains: search, mode: 'insensitive' } },
        { contratista: { nombre: { contains: search, mode: 'insensitive' } } },
        { sede: { nombre: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.planificacionCargo.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          contratista: { select: { id: true, nombre: true } },
          sede: { select: { id: true, nombre: true } },
        },
      }),
      prisma.planificacionCargo.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Planificaciones de cargos obtenidas exitosamente',
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

export const getPlanificacionCargoById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await prisma.planificacionCargo.findUnique({
      where: { id },
      include: {
        contratista: { select: { id: true, nombre: true } },
        sede: { select: { id: true, nombre: true } },
      },
    });

    if (!item) {
      res.status(404).json({ success: false, message: 'Planificación de cargo no encontrada' });
      return;
    }

    res.json({ success: true, message: 'Planificación de cargo obtenida exitosamente', data: item });
  } catch (error) {
    next(error);
  }
};

export const createPlanificacionCargo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { contratistaId, sedeId, cargo, cantidad, fechaInicio, fechaFin } = req.body;

    const item = await prisma.planificacionCargo.create({
      data: {
        contratistaId,
        sedeId,
        cargo,
        cantidad: parseInt(cantidad),
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
      },
      include: {
        contratista: { select: { id: true, nombre: true } },
        sede: { select: { id: true, nombre: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Planificación de cargo creada exitosamente',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlanificacionCargo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { contratistaId, sedeId, cargo, cantidad, fechaInicio, fechaFin } = req.body;

    const data: Record<string, unknown> = {};
    if (contratistaId !== undefined) data.contratistaId = contratistaId;
    if (sedeId !== undefined) data.sedeId = sedeId;
    if (cargo !== undefined) data.cargo = cargo;
    if (cantidad !== undefined) data.cantidad = parseInt(cantidad);
    if (fechaInicio !== undefined) data.fechaInicio = new Date(fechaInicio);
    if (fechaFin !== undefined) data.fechaFin = new Date(fechaFin);

    const item = await prisma.planificacionCargo.update({
      where: { id },
      data,
      include: {
        contratista: { select: { id: true, nombre: true } },
        sede: { select: { id: true, nombre: true } },
      },
    });

    res.json({ success: true, message: 'Planificación de cargo actualizada exitosamente', data: item });
  } catch (error) {
    next(error);
  }
};

export const deletePlanificacionCargo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.planificacionCargo.delete({ where: { id } });
    res.json({ success: true, message: 'Planificación de cargo eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
};

export const bulkCreatePlanificacionesCargos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { rows } = req.body as {
      rows: { nombreSede: string; nitContratista: string; cargo: string; cantidad: number; fechaInicio: string; fechaFin: string }[];
    };

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(400).json({ success: false, message: 'No se proporcionaron filas para importar' });
      return;
    }

    const created: unknown[] = [];
    const errors: { fila: number; error: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const contratista = await prisma.contratista.findFirst({
          where: { nit: { equals: String(row.nitContratista).trim(), mode: 'insensitive' } },
          select: { id: true },
        });
        if (!contratista) {
          errors.push({ fila: i + 1, error: `Contratista con NIT "${row.nitContratista}" no encontrado` });
          continue;
        }

        const sede = await prisma.sede.findFirst({
          where: { nombre: { equals: String(row.nombreSede).trim(), mode: 'insensitive' } },
          select: { id: true },
        });
        if (!sede) {
          errors.push({ fila: i + 1, error: `Sede "${row.nombreSede}" no encontrada` });
          continue;
        }

        const item = await prisma.planificacionCargo.create({
          data: {
            contratistaId: contratista.id,
            sedeId: sede.id,
            cargo: String(row.cargo).trim(),
            cantidad: Number(row.cantidad),
            fechaInicio: new Date(row.fechaInicio),
            fechaFin: new Date(row.fechaFin),
          },
        });
        created.push(item);
      } catch {
        errors.push({ fila: i + 1, error: 'Error al procesar la fila' });
      }
    }

    res.json({
      success: true,
      message: `${created.length} registros creados, ${errors.length} con errores`,
      data: { created: created.length, errors },
    });
  } catch (error) {
    next(error);
  }
};
