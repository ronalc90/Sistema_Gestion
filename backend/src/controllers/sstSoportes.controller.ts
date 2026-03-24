import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import prisma from '../config/database';
import { supabase, BUCKET } from '../config/supabase';

// ── Listar soportes de un contratista ────────────────────────────────────────

export const getSoportes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { contratistaId } = req.params;
    const data = await prisma.soporteContratistaSST.findMany({
      where: { contratistaId },
      orderBy: { creadoEn: 'desc' },
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ── Listar soportes de un trabajador ─────────────────────────────────────────

export const getSoportesTrabajador = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { trabajadorId } = req.params;
    const data = await prisma.soporteContratistaSST.findMany({
      where: { trabajadorId },
      orderBy: { creadoEn: 'desc' },
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ── Subir soporte de contratista ──────────────────────────────────────────────

export const uploadSoporte = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { contratistaId } = req.params;
    const file = req.file;

    if (!file) {
      res.status(400).json({ success: false, message: 'No se recibió ningún archivo' });
      return;
    }

    const contratista = await prisma.contratistaSST.findUnique({ where: { id: contratistaId } });
    if (!contratista) {
      res.status(404).json({ success: false, message: 'Contratista no encontrado' });
      return;
    }

    const ext = file.originalname.split('.').pop() || 'bin';
    const storageKey = `contratistas/${contratistaId}/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storageKey, file.buffer, { contentType: file.mimetype, upsert: false });

    if (uploadError) {
      res.status(500).json({ success: false, message: `Error al subir archivo: ${uploadError.message}` });
      return;
    }

    const soporte = await prisma.soporteContratistaSST.create({
      data: {
        nombre: file.originalname,
        tipoDocumento: req.body.tipoDocumento || null,
        descripcion: req.body.descripcion || null,
        storageKey,
        mimeType: file.mimetype,
        tamanio: file.size,
        contratistaId,
      },
    });

    res.status(201).json({ success: true, message: 'Soporte subido correctamente', data: soporte });
  } catch (error) {
    next(error);
  }
};

// ── Subir soporte de trabajador ───────────────────────────────────────────────

export const uploadSoporteTrabajador = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { trabajadorId } = req.params;
    const file = req.file;

    if (!file) {
      res.status(400).json({ success: false, message: 'No se recibió ningún archivo' });
      return;
    }

    const trabajador = await prisma.trabajadorSST.findUnique({ where: { id: trabajadorId } });
    if (!trabajador) {
      res.status(404).json({ success: false, message: 'Trabajador no encontrado' });
      return;
    }

    const ext = file.originalname.split('.').pop() || 'bin';
    const storageKey = `trabajadores/${trabajadorId}/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storageKey, file.buffer, { contentType: file.mimetype, upsert: false });

    if (uploadError) {
      res.status(500).json({ success: false, message: `Error al subir archivo: ${uploadError.message}` });
      return;
    }

    const soporte = await prisma.soporteContratistaSST.create({
      data: {
        nombre: file.originalname,
        tipoDocumento: req.body.tipoDocumento || null,
        descripcion: req.body.descripcion || null,
        storageKey,
        mimeType: file.mimetype,
        tamanio: file.size,
        trabajadorId,
      },
    });

    res.status(201).json({ success: true, message: 'Soporte subido correctamente', data: soporte });
  } catch (error) {
    next(error);
  }
};

// ── Obtener URL firmada para visualizar ───────────────────────────────────────

export const getSoporteUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { soporteId } = req.params;
    const expiresIn = parseInt(req.query.expiresIn as string) || 3600; // 1 hora por defecto

    const soporte = await prisma.soporteContratistaSST.findUnique({ where: { id: soporteId } });
    if (!soporte) {
      res.status(404).json({ success: false, message: 'Soporte no encontrado' });
      return;
    }

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(soporte.storageKey, expiresIn);

    if (error || !data) {
      res.status(500).json({ success: false, message: `Error al generar URL: ${error?.message}` });
      return;
    }

    res.json({ success: true, data: { url: data.signedUrl, expiresIn } });
  } catch (error) {
    next(error);
  }
};

// ── Eliminar soporte ──────────────────────────────────────────────────────────

export const deleteSoporte = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { soporteId } = req.params;

    const soporte = await prisma.soporteContratistaSST.findUnique({ where: { id: soporteId } });
    if (!soporte) {
      res.status(404).json({ success: false, message: 'Soporte no encontrado' });
      return;
    }

    // Eliminar de Supabase Storage
    const { error } = await supabase.storage.from(BUCKET).remove([soporte.storageKey]);
    if (error) {
      console.warn('Error al eliminar de storage:', error.message);
    }

    await prisma.soporteContratistaSST.delete({ where: { id: soporteId } });

    res.json({ success: true, message: 'Soporte eliminado' });
  } catch (error) {
    next(error);
  }
};
