import api from './client';

export interface DashboardStats {
  empleados: { total: number; activos: number; porContratista: Array<{ contratista: string; cantidad: number }> }
  sedes: { total: number; activas: number }
  contratistas: { total: number; activos: number }
  visitantes: { hoy: number; enSitio: number }
  planificaciones: { hoy: number; pendientes: number; completadasHoy: number }
}

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard').then((r) => r.data),
}
