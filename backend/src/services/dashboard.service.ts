/**
 * Servicio de Dashboard
 * Proporciona KPIs y estadísticas para el panel principal
 */

import prisma from '../config/database';

export interface DashboardStats {
  empleados: {
    total: number;
    activos: number;
    porContratista: Array<{
      contratista: string;
      cantidad: number;
    }>;
  };
  sedes: {
    total: number;
    activas: number;
  };
  contratistas: {
    total: number;
    activos: number;
  };
  visitantes: {
    hoy: number;
    enSitio: number;
  };
  planificaciones: {
    hoy: number;
    pendientes: number;
    completadasHoy: number;
  };
}

/**
 * Obtener estadísticas del dashboard
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);

  // Ejecutar consultas en paralelo
  const [
    totalEmpleados,
    empleadosActivos,
    empleadosPorContratista,
    totalSedes,
    sedesActivas,
    totalContratistas,
    contratistasActivos,
    visitantesHoy,
    visitantesEnSitio,
    planificacionesHoy,
    planificacionesPendientes,
    planificacionesCompletadasHoy,
  ] = await Promise.all([
    // Empleados
    prisma.empleado.count(),
    prisma.empleado.count({ where: { estado: 'ACTIVO' } }),
    
    // Empleados agrupados por contratista
    prisma.empleado.groupBy({
      by: ['contratistaId'],
      _count: { id: true },
      where: { contratistaId: { not: null } },
    }),

    // Sedes
    prisma.sede.count(),
    prisma.sede.count({ where: { estado: 'ACTIVO' } }),

    // Contratistas
    prisma.contratista.count(),
    prisma.contratista.count({ where: { estado: 'ACTIVO' } }),

    // Visitantes hoy
    prisma.visitante.count({
      where: {
        fechaEntrada: {
          gte: hoy,
          lt: manana,
        },
      },
    }),
    prisma.visitante.count({ where: { estado: 'EN_SITIO' } }),

    // Planificaciones
    prisma.planificacion.count({
      where: {
        fecha: {
          gte: hoy,
          lt: manana,
        },
      },
    }),
    prisma.planificacion.count({ where: { estado: 'PENDIENTE' } }),
    prisma.planificacion.count({
      where: {
        estado: 'COMPLETADA',
        updatedAt: {
          gte: hoy,
          lt: manana,
        },
      },
    }),
  ]);

  // Obtener nombres de contratistas para los empleados agrupados
  const contratistasConNombres = await Promise.all(
    empleadosPorContratista.map(async (item) => {
      const contratista = await prisma.contratista.findUnique({
        where: { id: item.contratistaId! },
        select: { nombre: true },
      });
      return {
        contratista: contratista?.nombre || 'Sin contratista',
        cantidad: item._count.id,
      };
    })
  );

  return {
    empleados: {
      total: totalEmpleados,
      activos: empleadosActivos,
      porContratista: contratistasConNombres,
    },
    sedes: {
      total: totalSedes,
      activas: sedesActivas,
    },
    contratistas: {
      total: totalContratistas,
      activos: contratistasActivos,
    },
    visitantes: {
      hoy: visitantesHoy,
      enSitio: visitantesEnSitio,
    },
    planificaciones: {
      hoy: planificacionesHoy,
      pendientes: planificacionesPendientes,
      completadasHoy: planificacionesCompletadasHoy,
    },
  };
};

/**
 * Obtener datos para gráficas
 */
export const getChartData = async () => {
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  // Ingresos de empleados por día (últimos 30 días)
  const ingresosPorDia = await prisma.empleado.groupBy({
    by: ['fechaIngreso'],
    _count: { id: true },
    where: {
      fechaIngreso: {
        gte: new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: { fechaIngreso: 'asc' },
  });

  // Distribución de empleados por sede
  const empleadosPorSede = await prisma.sede.findMany({
    select: {
      nombre: true,
      _count: { select: { empleados: true } },
    },
  });

  // Planificaciones por estado
  const planificacionesPorEstado = await prisma.planificacion.groupBy({
    by: ['estado'],
    _count: { id: true },
  });

  return {
    ingresosPorDia: ingresosPorDia.map(item => ({
      fecha: item.fechaIngreso.toISOString().split('T')[0],
      cantidad: item._count.id,
    })),
    empleadosPorSede: empleadosPorSede.map(item => ({
      sede: item.nombre,
      cantidad: item._count.empleados,
    })),
    planificacionesPorEstado: planificacionesPorEstado.map(item => ({
      estado: item.estado,
      cantidad: item._count.id,
    })),
  };
};
