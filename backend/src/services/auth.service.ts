/**
 * Servicio de Autenticación
 * Maneja login, registro y generación de tokens JWT
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { env } from '../config/env';
import { JWTPayload, UserWithoutPassword } from '../types';

// Selección de campos de usuario (sin password)
const userSelect = {
  id: true,
  nombre: true,
  email: true,
  rol: true,
  estado: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
};

interface LoginInput {
  email: string;
  password: string;
  ip?: string;
  userAgent?: string;
}

interface RegisterInput {
  nombre: string;
  email: string;
  password: string;
  rol?: 'ADMIN_TOTAL' | 'ADMIN' | 'USUARIO' | 'SUPERVISOR';
}

interface AuthResponse {
  user: UserWithoutPassword;
  token: string;
}

/**
 * Iniciar sesión
 */
export const login = async (input: LoginInput): Promise<AuthResponse> => {
  // Buscar usuario por email
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  // Verificar estado
  if (user.estado !== 'ACTIVO') {
    throw new Error('Usuario inactivo o bloqueado');
  }

  // Verificar contraseña
  const isValidPassword = await bcrypt.compare(input.password, user.password);

  if (!isValidPassword) {
    throw new Error('Credenciales inválidas');
  }

  // Actualizar último login y registrar log
  await Promise.all([
    prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    }),
    prisma.userLog.create({
      data: {
        userId: user.id,
        accion: 'LOGIN',
        ip: input.ip || null,
        userAgent: input.userAgent || null,
      },
    }),
  ]);

  // Generar token JWT
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    rol: user.rol,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  // Retornar usuario sin contraseña
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword as UserWithoutPassword,
    token,
  };
};

/**
 * Registrar nuevo usuario
 */
export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  // Verificar si el email ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existingUser) {
    throw new Error('Ya existe un usuario con ese correo electrónico');
  }

  // Encriptar contraseña
  const hashedPassword = await bcrypt.hash(input.password, 10);

  // Crear usuario
  const user = await prisma.user.create({
    data: {
      nombre: input.nombre,
      email: input.email.toLowerCase(),
      password: hashedPassword,
      rol: input.rol || 'USUARIO',
    },
    select: userSelect,
  });

  // Generar token
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    rol: user.rol,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  return { user, token };
};

/**
 * Obtener usuario por ID
 */
export const getUserById = async (userId: string): Promise<UserWithoutPassword | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });

  return user;
};

/**
 * Cambiar contraseña
 */
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Verificar contraseña actual
  const isValid = await bcrypt.compare(currentPassword, user.password);

  if (!isValid) {
    throw new Error('Contraseña actual incorrecta');
  }

  // Encriptar nueva contraseña
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Actualizar
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  // Registrar log
  await prisma.userLog.create({
    data: {
      userId,
      accion: 'CAMBIAR_PASSWORD',
    },
  });
};
