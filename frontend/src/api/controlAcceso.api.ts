import api from './client';
import type { 
  RegistroAcceso, 
  ConfiguracionAcceso, 
  CodigoQRAcceso,
  DashboardControlAcceso,
  TipoPersonaAcceso
} from '../types';

// ==========================================
// PAYLOADS
// ==========================================

export interface RegistroAccesoPayload {
  tipoAcceso: 'ENTRADA' | 'SALIDA';
  tipoPersona: TipoPersonaAcceso;
  documento?: string;
  empleadoId?: string;
  contratistaId?: string;
  visitanteId?: string;
  sedeId: string;
  destinoId?: string;
  observaciones?: string;
  metodoAutenticacion: 'QR' | 'DOCUMENTO' | 'TARJETA' | 'MANUAL';
  temperatura?: number;
  itemsRegistrados?: string;
  vehiculoPlaca?: string;
}

export interface FiltrosAcceso {
  fechaDesde?: string;
  fechaHasta?: string;
  tipoPersona?: TipoPersonaAcceso;
  contratistaId?: string;
  documento?: string;
  sedeId?: string;
  categoria1?: string;
  categoria2?: string;
  categoria3?: string;
}

// ==========================================
// CATÁLOGOS
// ==========================================

export const catalogosAcceso = {
  tiposAcceso: [
    { value: 'ENTRADA', label: 'Entrada', icon: 'ArrowRight', color: 'green' },
    { value: 'SALIDA', label: 'Salida', icon: 'ArrowLeft', color: 'blue' },
  ],

  tiposPersona: [
    { value: 'EMPLEADO', label: 'Empleado', icon: 'User', color: 'blue' },
    { value: 'CONTRATISTA', label: 'Contratista', icon: 'Briefcase', color: 'orange' },
    { value: 'VISITANTE', label: 'Visitante', icon: 'UserGroup', color: 'purple' },
  ],

  modosVisitante: [
    { 
      value: 'NO_PERMITIR', 
      label: 'No permitir',
      descripcion: 'No se retorna o almacena ningún valor del evento. Para sistemas de terceros, éste es el modo recomendado.'
    },
    { 
      value: 'PERMITIR_ANONIMO', 
      label: 'Permitir anónimo',
      descripcion: 'Se registra el documento ingresado como un visitante genérico.'
    },
    { 
      value: 'PERMITIR_CON_REGISTRO', 
      label: 'Permitir con registro',
      descripcion: 'Se requiere el registro previo de visitantes sobre el sistema para que su documento pueda ser localizado.'
    },
  ],

  metodosAutenticacion: [
    { value: 'QR', label: 'Código QR', icon: 'QrCode' },
    { value: 'DOCUMENTO', label: 'Número de Documento', icon: 'Identification' },
    { value: 'TARJETA', label: 'Tarjeta de Acceso', icon: 'CreditCard' },
    { value: 'MANUAL', label: 'Registro Manual', icon: 'Pencil' },
  ],
};

// ==========================================
// API
// ==========================================

export const controlAccesoApi = {
  // Dashboard
  getDashboard: async (): Promise<{ data: DashboardControlAcceso }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            accesosMesActual: 1245,
            accesosHoy: 89,
            accesosPorTipo: { EMPLEADO: 756, CONTRATISTA: 342, VISITANTE: 147 },
            accesosPorMes: [
              { mes: 'Ene', cantidad: 980 },
              { mes: 'Feb', cantidad: 1120 },
              { mes: 'Mar', cantidad: 1245 },
            ],
            personasDentro: 45,
            visitantesActivos: 12,
            alertasPendientes: 3,
          }
        });
      }, 500);
    });
  },

  // Registros de Acceso
  list: async (_filtros?: FiltrosAcceso & { page?: number; limit?: number }): Promise<{ data: RegistroAcceso[]; meta: { total: number } }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: '1',
              fecha: '2026-03-23',
              hora: '08:30:15',
              tipoAcceso: 'ENTRADA',
              tipoPersona: 'EMPLEADO',
              empleadoId: '1',
              empleado: { id: '1', nombres: 'Juan', apellidos: 'Pérez', numeroId: '12345678' } as any,
              sedeId: '1',
              metodoAutenticacion: 'QR',
              observaciones: 'Ingreso normal',
              createdAt: '2026-03-23',
            },
            {
              id: '2',
              fecha: '2026-03-23',
              hora: '08:35:22',
              tipoAcceso: 'ENTRADA',
              tipoPersona: 'CONTRATISTA',
              contratistaId: '1',
              contratista: { id: '1', nombre: 'Constructora XYZ' } as any,
              sedeId: '1',
              metodoAutenticacion: 'DOCUMENTO',
              vehiculoPlaca: 'ABC123',
              createdAt: '2026-03-23',
            },
            {
              id: '3',
              fecha: '2026-03-23',
              hora: '09:00:45',
              tipoAcceso: 'ENTRADA',
              tipoPersona: 'VISITANTE',
              visitanteId: '1',
              visitante: { id: '1', nombre: 'Pedro Gómez', identificacion: '98765432' } as any,
              sedeId: '1',
              metodoAutenticacion: 'MANUAL',
              destinoId: '1',
              createdAt: '2026-03-23',
            },
          ],
          meta: { total: 3 }
        });
      }, 500);
    });
  },

  getById: async (id: string): Promise<{ data: RegistroAcceso }> => {
    return api.get(`/control-acceso/${id}`);
  },

  create: async (data: RegistroAccesoPayload): Promise<{ data: RegistroAcceso }> => {
    return api.post('/control-acceso', data);
  },

  // Configuración
  getConfiguracion: async (sedeId?: string): Promise<{ data: ConfiguracionAcceso }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: '1',
            modoVisitantes: 'PERMITIR_CON_REGISTRO',
            requiereTemperatura: false,
            requiereFoto: true,
            permitirAccesoManual: true,
            tiempoMaximoVisitaHoras: 8,
            notificarAdminNuevosRegistros: true,
            sedeId: sedeId || '1',
            updatedAt: '2026-03-23',
          }
        });
      }, 300);
    });
  },

  updateConfiguracion: async (id: string, data: Partial<ConfiguracionAcceso>): Promise<{ data: ConfiguracionAcceso }> => {
    return api.put(`/control-acceso/configuracion/${id}`, data);
  },

  // Códigos QR
  generarQR: async (sedeId: string): Promise<{ data: CodigoQRAcceso }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: '1',
            codigo: `QR-${sedeId}-${Date.now()}`,
            sedeId,
            activo: true,
            fechaGeneracion: new Date().toISOString(),
            fechaExpiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            usosMaximos: 1000,
            usosActuales: 0,
            tipoPermitido: ['EMPLEADO', 'CONTRATISTA'],
            createdAt: new Date().toISOString(),
          }
        });
      }, 300);
    });
  },

  listCodigosQR: async (): Promise<{ data: CodigoQRAcceso[] }> => {
    return api.get('/control-acceso/codigos-qr');
  },

  // Exportar
  exportarCSV: async (_filtros?: FiltrosAcceso): Promise<Blob> => {
    return new Promise((resolve) => {
      const csvContent = 'data:text/csv;charset=utf-8,ID,Fecha,Hora,Tipo,Tipo Persona,Documento,Nombre\n';
      const blob = new Blob([csvContent], { type: 'text/csv' });
      resolve(blob);
    });
  },

  // Estadísticas
  getEstadisticasPorTipo: async (_fechaDesde?: string, _fechaHasta?: string): Promise<{ data: Record<string, number> }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            EMPLEADO: 756,
            CONTRATISTA: 342,
            VISITANTE: 147,
          }
        });
      }, 300);
    });
  },

  getEstadisticasPorMes: async (_anio?: number): Promise<{ data: { mes: string; cantidad: number }[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            { mes: 'Ene', cantidad: 980 },
            { mes: 'Feb', cantidad: 1120 },
            { mes: 'Mar', cantidad: 1245 },
            { mes: 'Abr', cantidad: 0 },
            { mes: 'May', cantidad: 0 },
            { mes: 'Jun', cantidad: 0 },
            { mes: 'Jul', cantidad: 0 },
            { mes: 'Ago', cantidad: 0 },
            { mes: 'Sep', cantidad: 0 },
            { mes: 'Oct', cantidad: 0 },
            { mes: 'Nov', cantidad: 0 },
            { mes: 'Dic', cantidad: 0 },
          ]
        });
      }, 300);
    });
  },
};
