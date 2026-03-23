import { useState } from 'react';
import { 
  DocumentChartBarIcon, 
  ChartBarIcon,
  ChartPieIcon,
  TableCellsIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import type { ReporteActividadesParams } from '../../../types';
import { catalogosSGSST } from '../../../api/planeadorActividades.api';

interface Props {
  onGenerarReporte?: (params: ReporteActividadesParams) => void;
  loading?: boolean;
}

const tiposReporte = [
  { value: 'ACTIVIDADES', label: 'Resumen de Actividades', icon: DocumentChartBarIcon },
  { value: 'VENCIDAS', label: 'Actividades Vencidas', icon: CheckCircleIcon },
  { value: 'PHVA', label: 'Actividades por PHVA', icon: ChartBarIcon },
  { value: 'RECURSOS', label: 'Recursos por Responsable', icon: TableCellsIcon },
  { value: 'PRESUPUESTO', label: 'Presupuesto Asignado vs Ejecutado', icon: ChartPieIcon },
  { value: 'COBERTURA', label: 'Cobertura de Participación', icon: ChartBarIcon },
];

const agrupaciones = [
  { value: 'SEDE', label: 'Por Sede' },
  { value: 'MES', label: 'Por Mes' },
  { value: 'PROGRAMA', label: 'Por Programa' },
  { value: 'TIPO_EVENTO', label: 'Por Tipo de Evento' },
  { value: 'AREA', label: 'Por Área' },
  { value: 'RESPONSABLE', label: 'Por Responsable' },
];

const criterios = [
  { value: 'ESTADO', label: 'Estado' },
  { value: 'PRIORIDAD', label: 'Prioridad' },
  { value: 'CUMPLIMIENTO', label: 'Cumplimiento' },
  { value: 'COBERTURA', label: 'Cobertura' },
];

const tiposGrafico = [
  { value: 'BARRAS', label: 'Barras', icon: ChartBarIcon },
  { value: 'PASTEL', label: 'Pastel', icon: ChartPieIcon },
  { value: 'LINEA', label: 'Línea', icon: DocumentChartBarIcon },
  { value: 'TABLA', label: 'Tabla', icon: TableCellsIcon },
];

const periodos = [
  { value: 'ANIO', label: 'Año completo' },
  { value: 'SEMESTRE', label: 'Semestre' },
  { value: 'TRIMESTRE', label: 'Trimestre' },
  { value: 'MES', label: 'Mes' },
  { value: 'SEMANA', label: 'Semana' },
];

export default function ReportesPanel({ onGenerarReporte, loading }: Props) {
  const [params, setParams] = useState<Partial<ReporteActividadesParams>>({
    tipoReporte: 'ACTIVIDADES',
    agrupacion: 'MES',
    criterio: 'ESTADO',
    tipoGrafico: 'BARRAS',
    periodo: 'ANIO',
  });
  const [vistaPrevia, setVistaPrevia] = useState(false);

  const handleChange = <K extends keyof ReporteActividadesParams>(
    campo: K, 
    valor: ReporteActividadesParams[K]
  ) => {
    setParams(prev => ({ ...prev, [campo]: valor }));
  };

  const handleGenerar = () => {
    if (params.tipoReporte) {
      onGenerarReporte?.(params as ReporteActividadesParams);
      setVistaPrevia(true);
    }
  };

  const tipoSeleccionado = tiposReporte.find(t => t.value === params.tipoReporte);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Configuración */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FunnelIcon className="w-5 h-5" />
              Parámetros del Reporte
            </h3>

            {/* Tipo de Reporte */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Reporte <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {tiposReporte.map(tipo => (
                  <button
                    key={tipo.value}
                    onClick={() => handleChange('tipoReporte', tipo.value as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors
                      ${params.tipoReporte === tipo.value 
                        ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    <tipo.icon className="w-4 h-4" />
                    {tipo.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Agrupación */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Agrupar Por
              </label>
              <select
                value={params.agrupacion}
                onChange={(e) => handleChange('agrupacion', e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {agrupaciones.map(a => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>

            {/* Criterio */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Criterio de Análisis
              </label>
              <select
                value={params.criterio}
                onChange={(e) => handleChange('criterio', e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {criterios.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Tipo de Gráfico */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Visualización
              </label>
              <div className="grid grid-cols-2 gap-2">
                {tiposGrafico.map(tipo => (
                  <button
                    key={tipo.value}
                    onClick={() => handleChange('tipoGrafico', tipo.value as any)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                      ${params.tipoGrafico === tipo.value 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
                  >
                    <tipo.icon className="w-4 h-4" />
                    {tipo.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Período */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Período
              </label>
              <select
                value={params.periodo}
                onChange={(e) => handleChange('periodo', e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {periodos.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Rango de Fechas */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha Desde
                </label>
                <input
                  type="date"
                  value={params.fechaDesde || ''}
                  onChange={(e) => handleChange('fechaDesde', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha Hasta
                </label>
                <input
                  type="date"
                  value={params.fechaHasta || ''}
                  onChange={(e) => handleChange('fechaHasta', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Filtros Adicionales */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sede
              </label>
              <select
                value={params.sedeId || ''}
                onChange={(e) => handleChange('sedeId', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Todas las sedes</option>
                <option value="1">Sede Principal</option>
                <option value="2">Sede Norte</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Programa
              </label>
              <select
                value={params.programa || ''}
                onChange={(e) => handleChange('programa', e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Todos los programas</option>
                {catalogosSGSST.programas.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Botones */}
            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleGenerar}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium 
                         text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <ChartBarIcon className="w-4 h-4" />
                    Generar Reporte
                  </>
                )}
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium 
                         text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 
                         rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Exportar a Excel
              </button>
            </div>
          </div>
        </div>

        {/* Vista Previa */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 min-h-[500px]">
            {!vistaPrevia ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <DocumentChartBarIcon className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium">Vista previa del reporte</p>
                <p className="text-sm">Configure los parámetros y haga clic en "Generar Reporte"</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Encabezado del Reporte */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {tipoSeleccionado?.label}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Agrupado por: {agrupaciones.find(a => a.value === params.agrupacion)?.label} | 
                    Criterio: {criterios.find(c => c.value === params.criterio)?.label} | 
                    Período: {periodos.find(p => p.value === params.periodo)?.label}
                  </p>
                  {(params.fechaDesde || params.fechaHasta) && (
                    <p className="text-xs text-gray-400 mt-1">
                      Desde: {params.fechaDesde || 'Inicio'} hasta: {params.fechaHasta || 'Actual'}
                    </p>
                  )}
                </div>

                {/* Gráfico Simulado */}
                <div className="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    {tipoSeleccionado && (
                      <tipoSeleccionado.icon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    )}
                    <p>Gráfico de {tiposGrafico.find(t => t.value === params.tipoGrafico)?.label}</p>
                    <p className="text-xs">Datos del reporte generado</p>
                  </div>
                </div>

                {/* Tabla Resumen */}
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Resumen de Datos</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Categoría</th>
                          <th className="px-4 py-2 text-right font-medium text-gray-600 dark:text-gray-400">Cantidad</th>
                          <th className="px-4 py-2 text-right font-medium text-gray-600 dark:text-gray-400">Porcentaje</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {[
                          { cat: 'Enero', val: 15, pct: '25%' },
                          { cat: 'Febrero', val: 23, pct: '38%' },
                          { cat: 'Marzo', val: 22, pct: '37%' },
                        ].map((row, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.cat}</td>
                            <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">{row.val}</td>
                            <td className="px-4 py-2 text-right text-gray-500">{row.pct}</td>
                          </tr>
                        ))}
                        <tr className="font-semibold bg-gray-50 dark:bg-gray-800">
                          <td className="px-4 py-2 text-gray-800 dark:text-gray-100">Total</td>
                          <td className="px-4 py-2 text-right text-gray-800 dark:text-gray-100">60</td>
                          <td className="px-4 py-2 text-right text-gray-800 dark:text-gray-100">100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">60</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Actividades</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">78%</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Cumplimiento</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">$45M</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Presupuesto</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
