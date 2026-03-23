import api from './client';

export interface ActividadPayload {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export const actividadesApi = {
  list: (params?: Record<string, unknown>) => api.get('/actividades', { params }),
  listAll: () => api.get('/actividades/all'),
  getById: (id: string) => api.get(`/actividades/${id}`),
  create: (data: ActividadPayload) => api.post('/actividades', data),
  update: (id: string, data: Partial<ActividadPayload>) => api.put(`/actividades/${id}`, data),
  remove: (id: string) => api.delete(`/actividades/${id}`),
};
