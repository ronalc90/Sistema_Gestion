import api from './client';

export interface VisitantePayload {
  nombre: string;
  identificacion?: string;
  tipo?: string;
  empresa?: string;
  telefono?: string;
  email?: string;
  motivo: string;
  sedeId: string;
  observaciones?: string;
}

export const visitantesApi = {
  list: (params?: Record<string, unknown>) => api.get('/visitantes', { params }),
  getById: (id: string) => api.get(`/visitantes/${id}`),
  create: (data: VisitantePayload) => api.post('/visitantes', data),
  update: (id: string, data: Partial<VisitantePayload & { estado?: string; fechaSalida?: string }>) =>
    api.put(`/visitantes/${id}`, data),
  remove: (id: string) => api.delete(`/visitantes/${id}`),
  registrarSalida: (id: string) => api.post(`/visitantes/${id}/salida`),
};
