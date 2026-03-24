import api from './client'

export const planificacionesCargosApi = {
  list: (params?: Record<string, unknown>) => api.get('/planificaciones-cargos', { params }),
  getById: (id: string) => api.get(`/planificaciones-cargos/${id}`),
  create: (data: Record<string, unknown>) => api.post('/planificaciones-cargos', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/planificaciones-cargos/${id}`, data),
  remove: (id: string) => api.delete(`/planificaciones-cargos/${id}`),
  bulkCreate: (rows: Record<string, unknown>[]) => api.post('/planificaciones-cargos/bulk', { rows }),
}
