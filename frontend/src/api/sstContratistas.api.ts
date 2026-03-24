import api from './client';

export interface ContratistaSST {
  id: string
  razonSocial: string
  representante?: string
  nombreComercial?: string
  nit: string
  nitDigito?: string
  direccion?: string
  telefono?: string
  email?: string
  sitioWeb?: string
  tipo?: string
  tamano?: string
  departamento?: string
  municipio?: string
  actividadEconomica?: string
  arl?: string
  nivelRiesgo?: string
  vencimientoSS?: string
  operadorPagoSS?: string
  centroEntrenamiento?: string
  consultaExamenMedico: boolean
  ipsExamenes?: string
  clasificacionCategoria?: string
  clasificacionCuadrante?: string
  personaContacto?: string
  contactoAdmin?: string
  actividades?: string
  costoHora?: string
  activo: boolean
  actualizacionMasivaSS?: string
  actualizacionMasivaCursos?: string
  usuario?: string
  clave?: string
  permisosEspeciales: boolean
  categoria1?: string
  categoria2?: string
  categoria3?: string
  codigoSistemaExterno?: string
  estado: string
  diasCorte: number
  _count?: { trabajadores: number }
}

export interface TrabajadorSST {
  id: string
  documento: string
  nombre: string
  cargo?: string
  sede?: string
  historia: boolean
  activo: boolean
  habilitado: boolean
  parafiscales: boolean
  certificacion: boolean
  otrosCursos: boolean
  induccion: boolean
  contratistaId: string
  empleadoActivo: boolean
  fechaExpedicion?: string
  fechaNacimiento?: string
  sexo?: string
  estadoCivil?: string
  ubicacionFisica?: string
  tipoVinculacion?: string
  salario?: string
  nivelEscolaridad?: string
  raza?: string
  correo?: string
  eps?: string
  direccionResidencia?: string
  telefonoResidencia?: string
  telefonoMovil?: string
  grupoSanguineo?: string
  discapacidad?: string
  contactoEmergencias?: string
  telefonoEmergencias?: string
  enfermedades: string[]
  transporte?: string
  ingresoEmpresa?: string
  retiroEmpresa?: string
  vencExamen?: string
  vencAlturas?: string
  vencConfinados?: string
  certRequeridas: string[]
  accesoContratista: boolean
  estadoSS: boolean
  certTareas: boolean
  cursoEspecifico: boolean
  induccionSitio: boolean
  fechaRevision?: string
  periodicidadExamen: number
  accesoGeneral: boolean
  fotografia?: string
  notas?: string
}

export interface SoporteContratistaSST {
  id: string
  nombre: string
  tipoDocumento?: string
  descripcion?: string
  storageKey: string
  mimeType: string
  tamanio: number
  creadoEn: string
  contratistaId: string
}

type ContratistaInput = Omit<ContratistaSST, 'id' | '_count'>
type TrabajadorInput = Omit<TrabajadorSST, 'id'>

export const sstContratistasApi = {
  // ── Contratistas ──
  getAll: () =>
    api.get<{ success: boolean; data: ContratistaSST[] }>('/sst/contratistas/all').then(r => r.data.data),

  getList: (params?: { page?: number; limit?: number; search?: string; estado?: string }) =>
    api.get<{ success: boolean; data: ContratistaSST[]; meta: unknown }>('/sst/contratistas', { params }).then(r => r.data),

  getById: (id: string) =>
    api.get<{ success: boolean; data: ContratistaSST & { trabajadores: TrabajadorSST[] } }>(`/sst/contratistas/${id}`).then(r => r.data.data),

  create: (body: ContratistaInput) =>
    api.post<{ success: boolean; data: ContratistaSST }>('/sst/contratistas', body).then(r => r.data.data),

  update: (id: string, body: Partial<ContratistaInput>) =>
    api.put<{ success: boolean; data: ContratistaSST }>(`/sst/contratistas/${id}`, body).then(r => r.data.data),

  delete: (id: string) =>
    api.delete(`/sst/contratistas/${id}`).then(r => r.data),

  // ── Trabajadores ──
  getTrabajadores: (params?: { contratistaId?: string; search?: string; page?: number; limit?: number }) =>
    api.get<{ success: boolean; data: TrabajadorSST[] }>('/sst/contratistas/trabajadores', { params }).then(r => r.data.data),

  createTrabajador: (body: TrabajadorInput) =>
    api.post<{ success: boolean; data: TrabajadorSST }>('/sst/contratistas/trabajadores', body).then(r => r.data.data),

  updateTrabajador: (id: string, body: Partial<TrabajadorInput>) =>
    api.put<{ success: boolean; data: TrabajadorSST }>(`/sst/contratistas/trabajadores/${id}`, body).then(r => r.data.data),

  deleteTrabajador: (id: string) =>
    api.delete(`/sst/contratistas/trabajadores/${id}`).then(r => r.data),

  // ── Soportes ──
  getSoportes: (contratistaId: string) =>
    api.get<{ success: boolean; data: SoporteContratistaSST[] }>(`/sst/contratistas/${contratistaId}/soportes`).then(r => r.data.data),

  uploadSoporte: (contratistaId: string, file: File, tipoDocumento?: string, descripcion?: string) => {
    const form = new FormData();
    form.append('archivo', file);
    if (tipoDocumento) form.append('tipoDocumento', tipoDocumento);
    if (descripcion) form.append('descripcion', descripcion);
    return api.post<{ success: boolean; data: SoporteContratistaSST }>(`/sst/contratistas/${contratistaId}/soportes`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data.data);
  },

  getSoporteUrl: (soporteId: string) =>
    api.get<{ success: boolean; data: { url: string; expiresIn: number } }>(`/sst/contratistas/soportes/${soporteId}/url`).then(r => r.data.data),

  deleteSoporte: (soporteId: string) =>
    api.delete(`/sst/contratistas/soportes/${soporteId}`).then(r => r.data),

  // ── Soportes de trabajador ──
  getSoportesTrabajador: (trabajadorId: string) =>
    api.get<{ success: boolean; data: SoporteContratistaSST[] }>(`/sst/contratistas/trabajadores/${trabajadorId}/soportes`).then(r => r.data.data),

  uploadSoporteTrabajador: (trabajadorId: string, file: File, tipoDocumento?: string, descripcion?: string) => {
    const form = new FormData();
    form.append('archivo', file);
    if (tipoDocumento) form.append('tipoDocumento', tipoDocumento);
    if (descripcion) form.append('descripcion', descripcion);
    return api.post<{ success: boolean; data: SoporteContratistaSST }>(`/sst/contratistas/trabajadores/${trabajadorId}/soportes`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data.data);
  },
};
