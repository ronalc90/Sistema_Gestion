import api from './client';

export interface CentroCostoPayload {
  codigo: string;
  nombre: string;
  descripcion?: string;
  presupuesto?: number;
  activo?: boolean;
}

export const centrosCostoApi = {
  list: (params?: Record<string, unknown>) => api.get('/centros-costo', { params }),
  listAll: () => api.get('/centros-costo/all'),
  getById: (id: string) => api.get(`/centros-costo/${id}`),
  create: (data: CentroCostoPayload) => api.post('/centros-costo', data),
  update: (id: string, data: Partial<CentroCostoPayload>) => api.put(`/centros-costo/${id}`, data),
  remove: (id: string) => api.delete(`/centros-costo/${id}`),
};
