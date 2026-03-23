/**
 * Controlador de Empleados
 * CRUD de empleados con soporte para carga masiva
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

/**
 * GET /api/empleados
 * Listar empleados
 */
export const getEmpleados = async (
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
    const contratistaId = req.query.contratistaId as string;
    const estado = req.query.estado as string;

    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { nombres: { contains: search, mode: 'insensitive' } },
        { apellidos: { contains: search, mode: 'insensitive' } },
        { numeroId: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cargo: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (sedeId) where.sedeId = sedeId;
    if (contratistaId) where.contratistaId = contratistaId;
    if (estado) where.estado = estado;

    const [empleados, total] = await Promise.all([
      prisma.empleado.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          sede: {
            select: { id: true, nombre: true },
          },
          contratista: {
            select: { id: true, nombre: true },
          },
          centroCosto: {
            select: { id: true, codigo: true, nombre: true },
          },
        },
      }),
      prisma.empleado.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Empleados obtenidos exitosamente',
      data: empleados,
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
 * GET /api/empleados/all
 * Listar todos los empleados sin paginación
 */
export const getAllEmpleados = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const empleados = await prisma.empleado.findMany({
      orderBy: { nombres: 'asc' },
      select: { id: true, nombres: true, apellidos: true, numeroId: true, cargo: true, estado: true },
    });
    res.json({ success: true, message: 'Empleados obtenidos exitosamente', data: empleados });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/empleados/:id
 * Obtener empleado por ID
 */
export const getEmpleadoById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const empleado = await prisma.empleado.findUnique({
      where: { id },
      include: {
        sede: true,
        contratista: true,
        centroCosto: true,
        documentos: {
          select: {
            id: true,
            nombre: true,
            tipo: true,
            createdAt: true,
          },
        },
      },
    });

    if (!empleado) {
      res.status(404).json({
        success: false,
        message: 'Empleado no encontrado',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Empleado obtenido exitosamente',
      data: empleado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/empleados
 * Crear nuevo empleado
 */
export const createEmpleado = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      tipoId,
      numeroId,
      nombres,
      apellidos,
      email,
      telefono,
      fechaNacimiento,
      genero,
      direccion,
      cargo,
      fechaIngreso,
      salario,
      eps,
      fondoPensiones,
      arl,
      contactoEmergencia,
      telefonoEmergencia,
      sedeId,
      contratistaId,
      centroCostoId,
    } = req.body;

    const empleado = await prisma.empleado.create({
      data: {
        tipoId: tipoId || 'CC',
        numeroId,
        nombres,
        apellidos,
        email,
        telefono,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
        genero,
        direccion,
        cargo,
        fechaIngreso: fechaIngreso ? new Date(fechaIngreso) : new Date(),
        salario: salario ? parseFloat(salario) : null,
        eps,
        fondoPensiones,
        arl,
        contactoEmergencia,
        telefonoEmergencia,
        sedeId,
        contratistaId,
        centroCostoId,
      },
      include: {
        sede: { select: { id: true, nombre: true } },
        contratista: { select: { id: true, nombre: true } },
        centroCosto: { select: { id: true, codigo: true, nombre: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Empleado creado exitosamente',
      data: empleado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/empleados/:id
 * Actualizar empleado
 */
export const updateEmpleado = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Convertir fechas si existen
    if (data.fechaNacimiento) {
      data.fechaNacimiento = new Date(data.fechaNacimiento);
    }
    if (data.fechaIngreso) {
      data.fechaIngreso = new Date(data.fechaIngreso);
    }
    if (data.fechaRetiro) {
      data.fechaRetiro = new Date(data.fechaRetiro);
    }
    if (data.salario) {
      data.salario = parseFloat(data.salario);
    }

    const empleado = await prisma.empleado.update({
      where: { id },
      data,
      include: {
        sede: { select: { id: true, nombre: true } },
        contratista: { select: { id: true, nombre: true } },
        centroCosto: { select: { id: true, codigo: true, nombre: true } },
      },
    });

    res.json({
      success: true,
      message: 'Empleado actualizado exitosamente',
      data: empleado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/empleados/:id
 * Eliminar empleado
 */
export const deleteEmpleado = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.empleado.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Empleado eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/empleados/bulk
 * Crear empleados masivamente
 */
export const createBulkEmpleados = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const empleados = req.body.empleados;

    if (!Array.isArray(empleados) || empleados.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Debe proporcionar un array de empleados',
      });
      return;
    }

    const results = await prisma.$transaction(
      empleados.map((emp: Record<string, unknown>) =>
        prisma.empleado.create({
          data: {
            tipoId: (emp.tipoId as string) || 'CC',
            numeroId: emp.numeroId as string,
            nombres: emp.nombres as string,
            apellidos: emp.apellidos as string,
            email: emp.email as string | undefined,
            telefono: emp.telefono as string | undefined,
            fechaNacimiento: emp.fechaNacimiento
              ? new Date(emp.fechaNacimiento as string)
              : null,
            genero: emp.genero as string | undefined,
            direccion: emp.direccion as string | undefined,
            cargo: emp.cargo as string | undefined,
            fechaIngreso: emp.fechaIngreso
              ? new Date(emp.fechaIngreso as string)
              : new Date(),
            salario: emp.salario ? parseFloat(emp.salario as string) : null,
            eps: emp.eps as string | undefined,
            fondoPensiones: emp.fondoPensiones as string | undefined,
            arl: emp.arl as string | undefined,
            contactoEmergencia: emp.contactoEmergencia as string | undefined,
            telefonoEmergencia: emp.telefonoEmergencia as string | undefined,
            sedeId: emp.sedeId as string,
            contratistaId: emp.contratistaId as string | undefined,
            centroCostoId: emp.centroCostoId as string | undefined,
          },
        })
      )
    );

    res.status(201).json({
      success: true,
      message: `${results.length} empleados creados exitosamente`,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/empleados/bulk-update
 * Actualizar empleados masivamente
 */
export const updateBulkEmpleados = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { ids, data } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Debe proporcionar un array de IDs',
      });
      return;
    }

    const results = await prisma.$transaction(
      ids.map((id: string) =>
        prisma.empleado.update({
          where: { id },
          data,
        })
      )
    );

    res.json({
      success: true,
      message: `${results.length} empleados actualizados exitosamente`,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};
