import api from './client';

export const documentosApi = {
  list: (params?: Record<string, unknown>) => api.get('/documentos', { params }),
  getById: (id: string) => api.get(`/documentos/${id}`),
  upload: (formData: FormData) =>
    api.post('/documentos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, data: { nombre?: string; tipo?: string; descripcion?: string }) =>
    api.put(`/documentos/${id}`, data),
  remove: (id: string) => api.delete(`/documentos/${id}`),
  download: (id: string) => `${api.defaults.baseURL}/documentos/${id}/download`,
};
