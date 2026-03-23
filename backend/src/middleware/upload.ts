/**
 * Middleware para manejo de archivos con Multer
 * Configuración de subida de documentos
 */

import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { env } from '../config/env';

// Tipos MIME permitidos
const allowedMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
];

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (_req: Request, _file, cb) => {
    cb(null, env.UPLOAD_DIR);
  },
  filename: (_req: Request, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// Filtro de archivos
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
  }
};

// Configuración de Multer
export const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
  },
  fileFilter,
});

// Middleware para manejo de errores de Multer
export const handleUploadError = (err: Error, req: Request, res: Response, next: Function) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `El archivo excede el tamaño máximo permitido de ${env.MAX_FILE_SIZE / 1024 / 1024}MB`,
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  
  next();
};

// Exportar configuración individual
export const uploadSingle = (fieldName: string) => upload.single(fieldName);
export const uploadMultiple = (fieldName: string, maxCount: number = 10) => 
  upload.array(fieldName, maxCount);
