import api from './client';

export interface EmpleadoPayload {
  tipoId: string;
  numeroId: string;
  nombres: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  genero?: string;
  direccion?: string;
  cargo?: string;
  fechaIngreso?: string;
  salario?: number;
  estado?: string;
  eps?: string;
  fondoPensiones?: string;
  arl?: string;
  contactoEmergencia?: string;
  telefonoEmergencia?: string;
  sedeId: string;
  contratistaId?: string;
  centroCostoId?: string;
}

export const empleadosApi = {
  list: (params?: Record<string, unknown>) => api.get('/empleados', { params }),
  listAll: () => api.get('/empleados/all'),
  getById: (id: string) => api.get(`/empleados/${id}`),
  create: (data: EmpleadoPayload) => api.post('/empleados', data),
  update: (id: string, data: Partial<EmpleadoPayload>) => api.put(`/empleados/${id}`, data),
  remove: (id: string) => api.delete(`/empleados/${id}`),
};
