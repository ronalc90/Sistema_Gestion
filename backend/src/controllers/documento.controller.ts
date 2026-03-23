/**
 * Controlador de Documentos
 * Gestión de documentos de empleados
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';

/**
 * GET /api/documentos
 * Listar documentos
 */
export const getDocumentos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const empleadoId = req.query.empleadoId as string;
    const tipo = req.query.tipo as string;
    const carpeta = req.query.carpeta as string;

    const where: Record<string, unknown> = {};
    
    if (empleadoId) where.empleadoId = empleadoId;
    if (tipo) where.tipo = tipo;
    if (carpeta) where.carpeta = carpeta;

    const [documentos, total] = await Promise.all([
      prisma.documento.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          empleado: {
            select: { id: true, nombres: true, apellidos: true, numeroId: true },
          },
          subidoPor: {
            select: { id: true, nombre: true },
          },
        },
      }),
      prisma.documento.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Documentos obtenidos exitosamente',
      data: documentos,
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
 * GET /api/documentos/:id
 * Obtener documento por ID
 */
export const getDocumentoById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const documento = await prisma.documento.findUnique({
      where: { id },
      include: {
        empleado: true,
        subidoPor: {
          select: { id: true, nombre: true, email: true },
        },
      },
    });

    if (!documento) {
      res.status(404).json({
        success: false,
        message: 'Documento no encontrado',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Documento obtenido exitosamente',
      data: documento,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/documentos/:id/download
 * Descargar archivo de documento
 */
export const downloadDocumento = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const documento = await prisma.documento.findUnique({
      where: { id },
    });

    if (!documento) {
      res.status(404).json({
        success: false,
        message: 'Documento no encontrado',
      });
      return;
    }

    const filePath = path.join(process.cwd(), documento.url);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        success: false,
        message: 'Archivo no encontrado en el servidor',
      });
      return;
    }

    res.setHeader('Content-Disposition', `attachment; filename="${documento.nombre}"`);
    res.setHeader('Content-Type', documento.mimeType);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/documentos
 * Subir nuevo documento
 */
export const createDocumento = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No se ha subido ningún archivo',
      });
      return;
    }

    const { nombre, tipo, descripcion, empleadoId, carpeta } = req.body;

    const documento = await prisma.documento.create({
      data: {
        nombre: nombre || req.file.originalname,
        tipo: tipo || 'OTRO',
        descripcion,
        url: `${env.UPLOAD_DIR}/${req.file.filename}`,
        tamanio: req.file.size,
        mimeType: req.file.mimetype,
        carpeta: carpeta || 'general',
        empleadoId,
        subidoPorId: req.user!.id,
      },
      include: {
        empleado: {
          select: { id: true, nombres: true, apellidos: true },
        },
        subidoPor: {
          select: { id: true, nombre: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Documento subido exitosamente',
      data: documento,
    });
  } catch (error) {
    // Eliminar archivo si falla la creación en BD
    if (req.file) {
      const filePath = path.join(process.cwd(), env.UPLOAD_DIR, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

/**
 * PUT /api/documentos/:id
 * Actualizar información del documento
 */
export const updateDocumento = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, tipo, descripcion, carpeta } = req.body;

    const documento = await prisma.documento.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(tipo && { tipo }),
        ...(descripcion !== undefined && { descripcion }),
        ...(carpeta && { carpeta }),
      },
      include: {
        empleado: {
          select: { id: true, nombres: true, apellidos: true },
        },
        subidoPor: {
          select: { id: true, nombre: true },
        },
      },
    });

    res.json({
      success: true,
      message: 'Documento actualizado exitosamente',
      data: documento,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/documentos/:id
 * Eliminar documento
 */
export const deleteDocumento = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const documento = await prisma.documento.findUnique({
      where: { id },
    });

    if (!documento) {
      res.status(404).json({
        success: false,
        message: 'Documento no encontrado',
      });
      return;
    }

    // Eliminar archivo físico
    const filePath = path.join(process.cwd(), documento.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Eliminar registro de BD
    await prisma.documento.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Documento eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
