/**
 * Middleware de validación usando express-validator
 * Esquemas de validación reutilizables
 */

import { body, param, query, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Middleware para manejar errores de validación
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : err.type,
      message: err.msg,
    }));

    res.status(400).json({
      success: false,
      message: 'Error de validación',
      error: formattedErrors,
    });
    return;
  }

  next();
};

// ==========================================
// VALIDACIONES DE AUTENTICACIÓN
// ==========================================

export const loginValidation: ValidationChain[] = [
  body('email')
    .notEmpty().withMessage('Por favor introduzca su correo electrónico *')
    .isEmail().withMessage('Correo electrónico inválido'),
  body('password')
    .notEmpty().withMessage('Por favor, introduzca su contraseña *'),
];

export const registerValidation: ValidationChain[] = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  body('email')
    .notEmpty().withMessage('El correo electrónico es obligatorio')
    .isEmail().withMessage('Correo electrónico inválido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('confirmPassword')
    .notEmpty().withMessage('Debe confirmar su contraseña')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),
];

// ==========================================
// VALIDACIONES COMUNES
// ==========================================

export const paginationValidation: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('La página debe ser un número mayor a 0'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),
];

export const uuidParamValidation = (paramName: string): ValidationChain[] => [
  param(paramName)
    .isUUID().withMessage(`El parámetro ${paramName} debe ser un UUID válido`),
];

// ==========================================
// VALIDACIONES DE SEDES
// ==========================================

export const sedeValidation: ValidationChain[] = [
  body('nombre')
    .notEmpty().withMessage('El nombre de la sede es obligatorio'),
  body('direccion')
    .optional()
    .isString().withMessage('La dirección debe ser texto'),
  body('ciudad')
    .optional()
    .isString().withMessage('La ciudad debe ser texto'),
  body('estado')
    .optional()
    .isIn(['ACTIVO', 'INACTIVO']).withMessage('Estado inválido'),
];

// ==========================================
// VALIDACIONES DE EMPLEADOS
// ==========================================

export const empleadoValidation: ValidationChain[] = [
  body('tipoId')
    .optional()
    .isIn(['CC', 'CE', 'PASAPORTE', 'NIT']).withMessage('Tipo de identificación inválido'),
  body('numeroId')
    .notEmpty().withMessage('El número de identificación es obligatorio'),
  body('nombres')
    .notEmpty().withMessage('Los nombres son obligatorios'),
  body('apellidos')
    .notEmpty().withMessage('Los apellidos son obligatorios'),
  body('email')
    .optional()
    .isEmail().withMessage('Correo electrónico inválido'),
  body('sedeId')
    .notEmpty().withMessage('La sede es obligatoria')
    .isUUID().withMessage('ID de sede inválido'),
  body('contratistaId')
    .optional()
    .isUUID().withMessage('ID de contratista inválido'),
  body('centroCostoId')
    .optional()
    .isUUID().withMessage('ID de centro de costo inválido'),
];

// ==========================================
// VALIDACIONES DE CONTRATISTAS
// ==========================================

export const contratistaValidation: ValidationChain[] = [
  body('nombre')
    .notEmpty().withMessage('El nombre del contratista es obligatorio'),
  body('nit')
    .optional()
    .isString().withMessage('El NIT debe ser texto'),
  body('email')
    .optional()
    .isEmail().withMessage('Correo electrónico inválido'),
];

// ==========================================
// VALIDACIONES DE VISITANTES
// ==========================================

export const visitanteValidation: ValidationChain[] = [
  body('nombre')
    .notEmpty().withMessage('El nombre del visitante es obligatorio'),
  body('tipo')
    .optional()
    .isIn(['PERSONAL', 'EMPRESARIAL', 'PROVEEDOR', 'CLIENTE', 'OTRO'])
    .withMessage('Tipo de visitante inválido'),
  body('motivo')
    .notEmpty().withMessage('El motivo de la visita es obligatorio'),
  body('sedeId')
    .notEmpty().withMessage('La sede es obligatoria')
    .isUUID().withMessage('ID de sede inválido'),
];

// ==========================================
// VALIDACIONES DE PLANIFICACIÓN
// ==========================================

export const planificacionValidation: ValidationChain[] = [
  body('fecha')
    .notEmpty().withMessage('La fecha es obligatoria')
    .isISO8601().withMessage('Fecha inválida'),
  body('empleadoId')
    .notEmpty().withMessage('El empleado es obligatorio')
    .isUUID().withMessage('ID de empleado inválido'),
  body('estado')
    .optional()
    .isIn(['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'])
    .withMessage('Estado inválido'),
];
