/**
 * Controlador de Usuarios
 * CRUD de usuarios del sistema + métricas de plataforma
 */

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';

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

/**
 * GET /api/users
 * Listar usuarios con paginación
 */
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;

    const where = search
      ? {
          OR: [
            { nombre: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: userSelect,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Usuarios obtenidos exitosamente',
      data: users,
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
 * GET /api/users/:id
 * Obtener usuario por ID
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Usuario obtenido exitosamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users
 * Crear nuevo usuario (solo ADMIN_TOTAL)
 */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nombre, email, password, rol, estado } = req.body;

    if (!nombre || !email || !password) {
      res.status(400).json({ success: false, message: 'Nombre, email y contraseña son requeridos' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      res.status(400).json({ success: false, message: 'Ya existe un usuario con ese correo' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nombre,
        email: email.toLowerCase(),
        password: hashedPassword,
        rol: rol || 'USUARIO',
        estado: estado || 'ACTIVO',
      },
      select: userSelect,
    });

    // Log
    if (req.user?.id) {
      await prisma.userLog.create({
        data: {
          userId: req.user.id,
          accion: 'CREAR_USUARIO',
          metadata: user.id,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 * Actualizar usuario
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, email, rol, estado, password } = req.body;

    // Si se cambia el email, verificar que no exista
    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email: email.toLowerCase(), NOT: { id } },
      });
      if (existing) {
        res.status(400).json({ success: false, message: 'Ya existe un usuario con ese correo' });
        return;
      }
    }

    const updateData: Record<string, unknown> = {
      ...(nombre && { nombre }),
      ...(email && { email: email.toLowerCase() }),
      ...(rol && { rol }),
      ...(estado && { estado }),
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: userSelect,
    });

    if (req.user?.id) {
      await prisma.userLog.create({
        data: {
          userId: req.user.id,
          accion: 'EDITAR_USUARIO',
          metadata: id,
        },
      });
    }

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 * Eliminar usuario
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (id === req.user?.id) {
      res.status(400).json({
        success: false,
        message: 'No puede eliminar su propio usuario',
      });
      return;
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }

    // No permitir eliminar ADMIN_TOTAL
    if (targetUser.rol === 'ADMIN_TOTAL') {
      res.status(403).json({ success: false, message: 'No se puede eliminar al super administrador' });
      return;
    }

    if (req.user?.id) {
      await prisma.userLog.create({
        data: {
          userId: req.user.id,
          accion: 'ELIMINAR_USUARIO',
          metadata: id,
        },
      });
    }

    await prisma.user.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id/status
 * Cambiar estado del usuario
 */
export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (id === req.user?.id && estado !== 'ACTIVO') {
      res.status(400).json({
        success: false,
        message: 'No puede desactivar su propio usuario',
      });
      return;
    }

    const user = await prisma.user.update({
      where: { id },
      data: { estado },
      select: userSelect,
    });

    res.json({
      success: true,
      message: 'Estado actualizado exitosamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/metrics
 * Métricas de uso de la plataforma (solo ADMIN_TOTAL)
 */
export const getMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalUsers,
      usersByRole,
      usersByStatus,
      logsHoy,
      logsMes,
      recentLogs,
      loginsByDay,
    ] = await Promise.all([
      // Total usuarios
      prisma.user.count(),

      // Por rol
      prisma.user.groupBy({
        by: ['rol'],
        _count: { id: true },
      }),

      // Por estado
      prisma.user.groupBy({
        by: ['estado'],
        _count: { id: true },
      }),

      // Logins hoy
      prisma.userLog.count({
        where: {
          accion: 'LOGIN',
          createdAt: { gte: startOfDay },
        },
      }),

      // Logins este mes
      prisma.userLog.count({
        where: {
          accion: 'LOGIN',
          createdAt: { gte: startOfMonth },
        },
      }),

      // Últimos 20 eventos
      prisma.userLog.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { nombre: true, email: true, rol: true },
          },
        },
      }),

      // Logins por día (últimos 7 días)
      prisma.$queryRaw<{ dia: string; logins: bigint }[]>`
        SELECT
          TO_CHAR(created_at AT TIME ZONE 'America/Bogota', 'YYYY-MM-DD') AS dia,
          COUNT(*)::bigint AS logins
        FROM user_logs
        WHERE accion = 'LOGIN'
          AND created_at >= NOW() - INTERVAL '7 days'
        GROUP BY dia
        ORDER BY dia ASC
      `,
    ]);

    // Usuarios registrados por día (últimos 7 días)
    const newUsersByDay = await prisma.$queryRaw<{ dia: string; nuevos: bigint }[]>`
      SELECT
        TO_CHAR(created_at AT TIME ZONE 'America/Bogota', 'YYYY-MM-DD') AS dia,
        COUNT(*)::bigint AS nuevos
      FROM users
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY dia
      ORDER BY dia ASC
    `;

    res.json({
      success: true,
      message: 'Métricas obtenidas exitosamente',
      data: {
        resumen: {
          totalUsuarios: totalUsers,
          loginsHoy: logsHoy,
          loginsMes: logsMes,
        },
        usuariosPorRol: usersByRole.map((r) => ({ rol: r.rol, cantidad: r._count.id })),
        usuariosPorEstado: usersByStatus.map((s) => ({ estado: s.estado, cantidad: s._count.id })),
        loginsPorDia: loginsByDay.map((r) => ({ dia: r.dia, logins: Number(r.logins) })),
        nuevosUsuariosPorDia: newUsersByDay.map((r) => ({ dia: r.dia, nuevos: Number(r.nuevos) })),
        actividadReciente: recentLogs.map((log) => ({
          id: log.id,
          accion: log.accion,
          usuario: log.user.nombre,
          email: log.user.email,
          rol: log.user.rol,
          fecha: log.createdAt,
          ip: log.ip,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
