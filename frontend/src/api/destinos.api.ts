import api from './client';

export interface DestinoPayload {
  nombre: string;
  descripcion?: string;
  estado?: string;
  sedeId: string;
}

export const destinosApi = {
  list: (params?: Record<string, unknown>) => api.get('/destinos', { params }),
  listAll: () => api.get('/destinos/all'),
  getById: (id: string) => api.get(`/destinos/${id}`),
  create: (data: DestinoPayload) => api.post('/destinos', data),
  update: (id: string, data: Partial<DestinoPayload>) => api.put(`/destinos/${id}`, data),
  remove: (id: string) => api.delete(`/destinos/${id}`),
};
