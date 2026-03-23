import api from './client';
import type { 
  ActividadPlaneada, 
  FiltrosActividades, 
  DashboardActividades,
  ReporteActividadesParams,
  TipoEventoSGSST,
  ProgramaSGSST,
  TematicaSGSST,
  EstadoActividad
} from '../types';

// ==========================================
// PAYLOADS
// ==========================================

export interface ParticipantePayload {
  empleadoId?: string;
  contratistaId?: string;
  externoNombre?: string;
  externoEmail?: string;
  externoTelefono?: string;
  externoEmpresa?: string;
  asistio?: boolean;
  observaciones?: string;
}

export interface ActividadPlaneadaPayload {
  codigo?: string;
  nombre: string;
  descripcion?: string;
  tipoEvento: TipoEventoSGSST;
  programa: ProgramaSGSST;
  tematica: TematicaSGSST;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  estado?: 'PLANEADO' | 'EN_PROCESO' | 'REPROGRAMADO' | 'FINALIZADA' | 'CANCELADA';
  modalidad: 'PRESENCIAL' | 'VIRTUAL' | 'COMBINADA';
  fasePHVA: 'PLANEAR' | 'HACER' | 'VERIFICAR' | 'ACTUAR';
  
  fechaInicio: string;
  fechaFin: string;
  horaInicio?: string;
  horaFin?: string;
  
  responsableId: string;
  contratistaId?: string;
  empleadoResponsableId?: string;
  
  sedeId?: string;
  categoria1?: string;
  categoria2?: string;
  categoria3?: string;
  
  presupuestoAsignado?: number;
  presupuestoEjecutado?: number;
  recursos?: string;
  
  participantes?: ParticipantePayload[];
  cantidadParticipantes?: number;
  coberturaEsperada?: number;
  
  observaciones?: string;
  resultados?: string;
}

// ==========================================
// CATÁLOGOS
// ==========================================

export const catalogosSGSST = {
  tiposEvento: [
    { value: 'CAPACITACION', label: 'Capacitación', icon: 'AcademicCap' },
    { value: 'INSPECCIONES', label: 'Inspecciones', icon: 'ClipboardDocument' },
    { value: 'SIMULACROS', label: 'Simulacros', icon: 'Fire' },
    { value: 'REUNIONES', label: 'Reuniones', icon: 'Users' },
    { value: 'ACCIDENTES', label: 'Accidentes', icon: 'ExclamationTriangle' },
    { value: 'EPP', label: 'EPP', icon: 'ShieldCheck' },
    { value: 'EXAMENES_MEDICOS', label: 'Exámenes Médicos', icon: 'Heart' },
    { value: 'INDUCCION', label: 'Inducción', icon: 'UserPlus' },
    { value: 'INVESTIGACION', label: 'Investigación', icon: 'MagnifyingGlass' },
    { value: 'MEJORA', label: 'Mejora', icon: 'ArrowTrendingUp' },
    { value: 'AUDITORIA', label: 'Auditoría', icon: 'DocumentCheck' },
    { value: 'OTRO', label: 'Otro', icon: 'Document' },
  ] as { value: TipoEventoSGSST; label: string; icon: string }[],

  programas: [
    { value: 'SG-SST', label: 'SG-SST' },
    { value: 'RIESGO_QUIMICO', label: 'Riesgo Químico' },
    { value: 'TRABAJO_ALTURAS', label: 'Trabajo en Alturas' },
    { value: 'ESPACIOS_CONFINADOS', label: 'Espacios Confinados' },
    { value: 'EQUIPO_PESADO', label: 'Equipo Pesado' },
    { value: 'SEGURIDAD_VIAL', label: 'Seguridad Vial' },
    { value: 'EMERGENCIAS', label: 'Emergencias' },
    { value: 'MEDICINA_LABORAL', label: 'Medicina Laboral' },
    { value: 'AUDITORIA', label: 'Auditoría' },
    { value: 'GESTION_RIESGO', label: 'Gestión de Riesgo' },
    { value: 'OTRO', label: 'Otro' },
  ] as { value: ProgramaSGSST; label: string }[],

  tematicas: [
    { value: 'SEGURIDAD_VIAL', label: 'Seguridad Vial' },
    { value: 'RIESGO_BIOLOGICO', label: 'Riesgo Biológico' },
    { value: 'ERGONOMIA', label: 'Ergonomía' },
    { value: 'RIESGO_ELECTRICO', label: 'Riesgo Eléctrico' },
    { value: 'FISICO_QUIMICO', label: 'Físico-Químico' },
    { value: 'PSICOSOCIAL', label: 'Psicosocial' },
    { value: 'MECANICO', label: 'Mecánico' },
    { value: 'LOCATIVO', label: 'Locativo' },
    { value: 'PUBLICO', label: 'Público' },
    { value: 'SST_GENERAL', label: 'SST General' },
    { value: 'EMERGENCIA', label: 'Emergencia' },
    { value: 'PRIMEROS_AUXILIOS', label: 'Primeros Auxilios' },
    { value: 'BRIGADISTA', label: 'Brigadista' },
    { value: 'EVACUACION', label: 'Evacuación' },
    { value: 'OTRO', label: 'Otro' },
  ] as { value: TematicaSGSST; label: string }[],

  prioridades: [
    { value: 'BAJA', label: 'Baja', color: 'gray' },
    { value: 'MEDIA', label: 'Media', color: 'blue' },
    { value: 'ALTA', label: 'Alta', color: 'orange' },
    { value: 'URGENTE', label: 'Urgente', color: 'red' },
  ] as { value: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE'; label: string; color: string }[],

  estados: [
    { value: 'PLANEADO', label: 'Planeado', color: 'gray' },
    { value: 'EN_PROCESO', label: 'En proceso', color: 'blue' },
    { value: 'REPROGRAMADO', label: 'Reprogramado', color: 'yellow' },
    { value: 'FINALIZADA', label: 'Finalizada', color: 'green' },
    { value: 'CANCELADA', label: 'Cancelada', color: 'red' },
  ] as { value: 'PLANEADO' | 'EN_PROCESO' | 'REPROGRAMADO' | 'FINALIZADA' | 'CANCELADA'; label: string; color: string }[],

  modalidades: [
    { value: 'PRESENCIAL', label: 'Presencial', icon: 'BuildingOffice' },
    { value: 'VIRTUAL', label: 'Virtual', icon: 'VideoCamera' },
    { value: 'COMBINADA', label: 'Combinada', icon: 'DevicePhoneMobile' },
  ] as { value: 'PRESENCIAL' | 'VIRTUAL' | 'COMBINADA'; label: string; icon: string }[],

  fasesPHVA: [
    { value: 'PLANEAR', label: 'Planear', color: 'blue', icon: 'Clipboard' },
    { value: 'HACER', label: 'Hacer', color: 'green', icon: 'Play' },
    { value: 'VERIFICAR', label: 'Verificar', color: 'yellow', icon: 'Eye' },
    { value: 'ACTUAR', label: 'Actuar', color: 'purple', icon: 'ArrowPath' },
  ] as { value: 'PLANEAR' | 'HACER' | 'VERIFICAR' | 'ACTUAR'; label: string; color: string; icon: string }[],
};

// ==========================================
// API
// ==========================================

export const planeadorActividadesApi = {
  // Dashboard
  getDashboard: async (_fechaDesde?: string, _fechaHasta?: string): Promise<{ data: DashboardActividades }> => {
    // Simulación - reemplazar con llamada real
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            totalActividades: 156,
            actividadesMesActual: 24,
            actividadesSinSede: 3,
            indicadorCumplimiento: 78,
            porPrioridad: { BAJA: 45, MEDIA: 62, ALTA: 35, URGENTE: 14 },
            porPHVA: { PLANEAR: 40, HACER: 65, VERIFICAR: 30, ACTUAR: 21 },
            porEstado: { PLANEADO: 50, EN_PROCESO: 30, REPROGRAMADO: 10, FINALIZADA: 60, CANCELADA: 6 },
            actividadesVencidas: 5,
            presupuestoAsignado: 45000000,
            presupuestoEjecutado: 32000000,
          }
        });
      }, 500);
    });
  },

  // CRUD
  list: async (_filtros?: FiltrosActividades & { page?: number; limit?: number }): Promise<{ data: ActividadPlaneada[]; meta: { total: number; page: number; totalPages: number } }> => {
    // Simulación - reemplazar con llamada real. _filtros se usará cuando se implemente el backend
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData: ActividadPlaneada[] = [
          {
            id: '1',
            codigo: 'ACT-2026-001',
            nombre: 'Capacitación en Trabajo en Alturas',
            descripcion: 'Capacitación obligatoria para personal que realiza trabajos en alturas mayores a 1.5m',
            tipoEvento: 'CAPACITACION',
            programa: 'TRABAJO_ALTURAS',
            tematica: 'SST_GENERAL',
            prioridad: 'ALTA',
            estado: 'FINALIZADA',
            modalidad: 'PRESENCIAL',
            fasePHVA: 'HACER',
            fechaInicio: '2026-03-15',
            fechaFin: '2026-03-15',
            horaInicio: '08:00',
            horaFin: '12:00',
            responsableId: '1',
            contratistaId: undefined,
            empleadoResponsableId: '1',
            sedeId: '1',
            categoria1: 'Operaciones',
            categoria2: 'Mantenimiento',
            categoria3: 'Alturas',
            presupuestoAsignado: 2500000,
            presupuestoEjecutado: 2350000,
            recursos: 'Proyector, material de capacitación, equipos de protección',
            participantes: [],
            cantidadParticipantes: 25,
            coberturaEsperada: 100,
            observaciones: 'Capacitación completada exitosamente',
            resultados: '25 personas capacitadas, 100% aprobación',
            empresaId: '1',
            creadoPorId: '1',
            createdAt: '2026-03-01',
            updatedAt: '2026-03-15',
          },
          {
            id: '2',
            codigo: 'ACT-2026-002',
            nombre: 'Inspección de extintores',
            descripcion: 'Revisión mensual de extintores en todas las sedes',
            tipoEvento: 'INSPECCIONES',
            programa: 'EMERGENCIAS',
            tematica: 'EMERGENCIA',
            prioridad: 'MEDIA',
            estado: 'EN_PROCESO',
            modalidad: 'PRESENCIAL',
            fasePHVA: 'VERIFICAR',
            fechaInicio: '2026-03-20',
            fechaFin: '2026-03-25',
            horaInicio: '09:00',
            horaFin: '17:00',
            responsableId: '2',
            sedeId: '1',
            categoria1: 'Seguridad',
            categoria2: 'Emergencias',
            categoria3: 'Equipos',
            presupuestoAsignado: 500000,
            presupuestoEjecutado: 150000,
            recursos: 'Checklist, cámara fotográfica',
            participantes: [],
            cantidadParticipantes: 3,
            coberturaEsperada: 100,
            empresaId: '1',
            creadoPorId: '1',
            createdAt: '2026-03-10',
            updatedAt: '2026-03-20',
          },
          {
            id: '3',
            codigo: 'ACT-2026-003',
            nombre: 'Simulacro de evacuación',
            descripcion: 'Simulacro trimestral de evacuación por sismo',
            tipoEvento: 'SIMULACROS',
            programa: 'EMERGENCIAS',
            tematica: 'EVACUACION',
            prioridad: 'URGENTE',
            estado: 'PLANEADO',
            modalidad: 'PRESENCIAL',
            fasePHVA: 'HACER',
            fechaInicio: '2026-04-05',
            fechaFin: '2026-04-05',
            horaInicio: '10:00',
            horaFin: '12:00',
            responsableId: '1',
            sedeId: '1',
            categoria1: 'Seguridad',
            categoria2: 'Emergencias',
            categoria3: 'Simulacros',
            presupuestoAsignado: 1000000,
            presupuestoEjecutado: 0,
            recursos: 'Megáfono, cronómetro, checklist',
            participantes: [],
            cantidadParticipantes: 150,
            coberturaEsperada: 95,
            empresaId: '1',
            creadoPorId: '1',
            createdAt: '2026-03-15',
            updatedAt: '2026-03-15',
          },
        ];
        resolve({
          data: mockData,
          meta: { total: 3, page: 1, totalPages: 1 }
        });
      }, 500);
    });
  },

  getById: async (id: string): Promise<{ data: ActividadPlaneada }> => {
    return api.get(`/planeador-actividades/${id}`);
  },

  create: async (data: ActividadPlaneadaPayload): Promise<{ data: ActividadPlaneada }> => {
    return api.post('/planeador-actividades', data);
  },

  update: async (id: string, data: Partial<ActividadPlaneadaPayload>): Promise<{ data: ActividadPlaneada }> => {
    return api.put(`/planeador-actividades/${id}`, data);
  },

  remove: async (id: string): Promise<void> => {
    return api.delete(`/planeador-actividades/${id}`);
  },

  // Acciones masivas
  bulkDelete: async (ids: string[]): Promise<void> => {
    return api.post('/planeador-actividades/bulk-delete', { ids });
  },

  bulkUpdateEstado: async (ids: string[], estado: EstadoActividad): Promise<void> => {
    return api.post('/planeador-actividades/bulk-update-estado', { ids, estado });
  },
  
  getDashboardStats: async (_fechaDesde?: string, _fechaHasta?: string): Promise<{ data: DashboardActividades }> => {
    // Simulación de estadísticas del dashboard
    return planeadorActividadesApi.getDashboard();
  },

  // Import/Export
  exportar: async (filtros?: FiltrosActividades, formato: 'csv' | 'excel' = 'excel'): Promise<Blob> => {
    return api.post('/planeador-actividades/exportar', { filtros, formato }, { responseType: 'blob' });
  },

  importar: async (file: File): Promise<{ success: number; errors: number; message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/planeador-actividades/importar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Reportes
  generarReporte: async (params: ReporteActividadesParams): Promise<Blob> => {
    return api.post('/planeador-actividades/reportes', params, { responseType: 'blob' });
  },

  getActividadesVencidas: async (): Promise<{ data: ActividadPlaneada[] }> => {
    return api.get('/planeador-actividades/vencidas');
  },

  getActividadesPorPHVA: async (fechaDesde?: string, fechaHasta?: string): Promise<{ data: Record<string, number> }> => {
    return api.get('/planeador-actividades/por-phva', { params: { fechaDesde, fechaHasta } });
  },

  getRecursosPorResponsable: async (fechaDesde?: string, fechaHasta?: string): Promise<{ data: any[] }> => {
    return api.get('/planeador-actividades/recursos-responsable', { params: { fechaDesde, fechaHasta } });
  },

  getPresupuestoEjecutado: async (fechaDesde?: string, fechaHasta?: string): Promise<{ data: { asignado: number; ejecutado: number } }> => {
    return api.get('/planeador-actividades/presupuesto', { params: { fechaDesde, fechaHasta } });
  },

  getCobertura: async (actividadId?: string): Promise<{ data: { esperada: number; real: number; porcentaje: number } }> => {
    return api.get('/planeador-actividades/cobertura', { params: { actividadId } });
  },
};
