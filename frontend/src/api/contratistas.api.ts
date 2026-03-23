import api from './client';

export interface ContratistaPayload {
  nombre: string;
  nit?: string;
  representante?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  estado?: string;
}

export const contratistasApi = {
  list: (params?: Record<string, unknown>) => api.get('/contratistas', { params }),
  listAll: () => api.get('/contratistas/all'),
  getById: (id: string) => api.get(`/contratistas/${id}`),
  create: (data: ContratistaPayload) => api.post('/contratistas', data),
  update: (id: string, data: Partial<ContratistaPayload>) => api.put(`/contratistas/${id}`, data),
  remove: (id: string) => api.delete(`/contratistas/${id}`),
};
