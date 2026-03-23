import api from './client';

export interface HorarioSede {
  dia: string;
  activo: boolean;
  horaInicio?: string;
  horaFin?: string;
}

export interface SedePayload {
  nombre: string;
  estado?: string;
  tiempoDescanso?: string;
  fechaInicial?: string;
  fechaFinal?: string;
  nombreColeccion?: string;
  centroCostoId?: string;
  horarios?: HorarioSede[];
}

export const sedesApi = {
  list: (params?: Record<string, unknown>) => api.get('/sedes', { params }),
  listAll: () => api.get('/sedes/all'),
  getById: (id: string) => api.get(`/sedes/${id}`),
  create: (data: SedePayload) => api.post('/sedes', data),
  update: (id: string, data: Partial<SedePayload>) => api.put(`/sedes/${id}`, data),
  remove: (id: string) => api.delete(`/sedes/${id}`),
};
