import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../../../components/common/Modal';
import { catalogosSGSST } from '../../../api/planeadorActividades.api';
import type { ActividadPlaneada, ParticipanteActividad } from '../../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  actividad?: ActividadPlaneada | null;
  onGuardar: (data: any) => void;
  onGuardarNuevo?: (data: any) => void;
}

const defaultForm = {
  codigo: '',
  nombre: '',
  descripcion: '',
  tipoEvento: '',
  programa: '',
  tematica: '',
  prioridad: 'MEDIA',
  estado: 'PLANEADO',
  modalidad: 'PRESENCIAL',
  fasePHVA: 'PLANEAR',
  fechaInicio: '',
  fechaFin: '',
  horaInicio: '',
  horaFin: '',
  responsableId: '',
  contratistaId: '',
  empleadoResponsableId: '',
  sedeId: '',
  categoria1: '',
  categoria2: '',
  categoria3: '',
  presupuestoAsignado: '',
  presupuestoEjecutado: '',
  recursos: '',
  coberturaEsperada: '',
  observaciones: '',
  resultados: '',
};

export default function ActividadModal({ isOpen, onClose, actividad, onGuardar, onGuardarNuevo }: Props) {
  const [form, setForm] = useState(defaultForm);
  const [participantes, setParticipantes] = useState<Partial<ParticipanteActividad>[]>([]);
  const [tabActiva, setTabActiva] = useState<'general' | 'participantes' | 'presupuesto'>('general');
  const isEdit = !!actividad;

  useEffect(() => {
    if (actividad) {
      setForm({
        codigo: actividad.codigo || '',
        nombre: actividad.nombre || '',
        descripcion: actividad.descripcion || '',
        tipoEvento: actividad.tipoEvento || '',
        programa: actividad.programa || '',
        tematica: actividad.tematica || '',
        prioridad: actividad.prioridad || 'MEDIA',
        estado: actividad.estado || 'PLANEADO',
        modalidad: actividad.modalidad || 'PRESENCIAL',
        fasePHVA: actividad.fasePHVA || 'PLANEAR',
        fechaInicio: actividad.fechaInicio || '',
        fechaFin: actividad.fechaFin || '',
        horaInicio: actividad.horaInicio || '',
        horaFin: actividad.horaFin || '',
        responsableId: actividad.responsableId || '',
        contratistaId: actividad.contratistaId || '',
        empleadoResponsableId: actividad.empleadoResponsableId || '',
        sedeId: actividad.sedeId || '',
        categoria1: actividad.categoria1 || '',
        categoria2: actividad.categoria2 || '',
        categoria3: actividad.categoria3 || '',
        presupuestoAsignado: actividad.presupuestoAsignado?.toString() || '',
        presupuestoEjecutado: actividad.presupuestoEjecutado?.toString() || '',
        recursos: actividad.recursos || '',
        coberturaEsperada: actividad.coberturaEsperada?.toString() || '',
        observaciones: actividad.observaciones || '',
        resultados: actividad.resultados || '',
      });
      setParticipantes(actividad.participantes || []);
    } else {
      setForm(defaultForm);
      setParticipantes([]);
    }
    setTabActiva('general');
  }, [actividad, isOpen]);

  const handleChange = (campo: string, valor: string) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = (e: React.FormEvent, guardarNuevo = false) => {
    e.preventDefault();
    const data = {
      ...form,
      presupuestoAsignado: form.presupuestoAsignado ? parseFloat(form.presupuestoAsignado) : undefined,
      presupuestoEjecutado: form.presupuestoEjecutado ? parseFloat(form.presupuestoEjecutado) : undefined,
      coberturaEsperada: form.coberturaEsperada ? parseInt(form.coberturaEsperada) : undefined,
      participantes,
    };
    if (guardarNuevo && onGuardarNuevo) {
      onGuardarNuevo(data);
    } else {
      onGuardar(data);
    }
  };

  const agregarParticipante = () => {
    setParticipantes([...participantes, { asistio: false }]);
  };

  const eliminarParticipante = (index: number) => {
    setParticipantes(participantes.filter((_, i) => i !== index));
  };

  const actualizarParticipante = (index: number, campo: string, valor: any) => {
    const nuevos = [...participantes];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setParticipantes(nuevos);
  };

  const tabs = [
    { id: 'general', label: 'Información General' },
    { id: 'participantes', label: `Participantes (${participantes.length})` },
    { id: 'presupuesto', label: 'Presupuesto' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar Actividad' : 'Nueva Actividad'}
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                     bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <div className="flex items-center gap-2">
            {!isEdit && onGuardarNuevo && (
              <button
                onClick={(e) => handleSubmit(e, true)}
                className="px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 
                         bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50"
              >
                Guardar y Nuevo
              </button>
            )}
            <button
              onClick={(e) => handleSubmit(e)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {isEdit ? 'Guardar Cambios' : 'Crear Actividad'}
            </button>
          </div>
        </div>
      }
    >
      <form id="actividad-form" className="space-y-4">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTabActiva(tab.id as any)}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors
                  ${tabActiva === tab.id 
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido General */}
        {tabActiva === 'general' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Código y Nombre */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Código <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.codigo}
                  onChange={(e) => handleChange('codigo', e.target.value)}
                  placeholder="ACT-2026-001"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Nombre de la actividad"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                value={form.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Clasificación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Evento <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.tipoEvento}
                  onChange={(e) => handleChange('tipoEvento', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="">Seleccionar...</option>
                  {catalogosSGSST.tiposEvento.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Programa <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.programa}
                  onChange={(e) => handleChange('programa', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="">Seleccionar...</option>
                  {catalogosSGSST.programas.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Temática <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.tematica}
                  onChange={(e) => handleChange('tematica', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="">Seleccionar...</option>
                  {catalogosSGSST.tematicas.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Estado, Prioridad, Modalidad, PHVA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estado
                </label>
                <select
                  value={form.estado}
                  onChange={(e) => handleChange('estado', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {catalogosSGSST.estados.map(e => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prioridad
                </label>
                <select
                  value={form.prioridad}
                  onChange={(e) => handleChange('prioridad', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {catalogosSGSST.prioridades.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Modalidad
                </label>
                <select
                  value={form.modalidad}
                  onChange={(e) => handleChange('modalidad', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {catalogosSGSST.modalidades.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fase PHVA
                </label>
                <select
                  value={form.fasePHVA}
                  onChange={(e) => handleChange('fasePHVA', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {catalogosSGSST.fasesPHVA.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha Inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.fechaInicio}
                  onChange={(e) => handleChange('fechaInicio', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha Fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.fechaFin}
                  onChange={(e) => handleChange('fechaFin', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hora Inicio
                </label>
                <input
                  type="time"
                  value={form.horaInicio}
                  onChange={(e) => handleChange('horaInicio', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hora Fin
                </label>
                <input
                  type="time"
                  value={form.horaFin}
                  onChange={(e) => handleChange('horaFin', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Responsable y Ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Responsable <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.responsableId}
                  onChange={(e) => handleChange('responsableId', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="1">Juan Pérez</option>
                  <option value="2">María García</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sede
                </label>
                <select
                  value={form.sedeId}
                  onChange={(e) => handleChange('sedeId', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Sin sede</option>
                  <option value="1">Sede Principal</option>
                  <option value="2">Sede Norte</option>
                </select>
              </div>
            </div>

            {/* Categorías */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoría 1
                </label>
                <input
                  type="text"
                  value={form.categoria1}
                  onChange={(e) => handleChange('categoria1', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoría 2
                </label>
                <input
                  type="text"
                  value={form.categoria2}
                  onChange={(e) => handleChange('categoria2', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoría 3
                </label>
                <input
                  type="text"
                  value={form.categoria3}
                  onChange={(e) => handleChange('categoria3', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab Participantes */}
        {tabActiva === 'participantes' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total: {participantes.length} participantes
              </p>
              <button
                type="button"
                onClick={agregarParticipante}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="w-4 h-4" />
                Agregar Participante
              </button>
            </div>

            {participantes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No hay participantes registrados</p>
                <p className="text-sm">Agregue participantes a la actividad</p>
              </div>
            ) : (
              <div className="space-y-3">
                {participantes.map((p, i) => (
                  <div key={i} className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Participante {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => eliminarParticipante(i)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Nombre (externo)"
                        value={p.externoNombre || ''}
                        onChange={(e) => actualizarParticipante(i, 'externoNombre', e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                                 bg-white dark:bg-gray-700"
                      />
                      <input
                        type="email"
                        placeholder="Email (externo)"
                        value={p.externoEmail || ''}
                        onChange={(e) => actualizarParticipante(i, 'externoEmail', e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                                 bg-white dark:bg-gray-700"
                      />
                      <input
                        type="text"
                        placeholder="Empresa (externo)"
                        value={p.externoEmpresa || ''}
                        onChange={(e) => actualizarParticipante(i, 'externoEmpresa', e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                                 bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`asistio-${i}`}
                        checked={p.asistio}
                        onChange={(e) => actualizarParticipante(i, 'asistio', e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor={`asistio-${i}`} className="text-sm">Asistió</label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Presupuesto */}
        {tabActiva === 'presupuesto' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Presupuesto Asignado
                </label>
                <input
                  type="number"
                  value={form.presupuestoAsignado}
                  onChange={(e) => handleChange('presupuestoAsignado', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Presupuesto Ejecutado
                </label>
                <input
                  type="number"
                  value={form.presupuestoEjecutado}
                  onChange={(e) => handleChange('presupuestoEjecutado', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recursos
              </label>
              <textarea
                value={form.recursos}
                onChange={(e) => handleChange('recursos', e.target.value)}
                placeholder="Liste los recursos necesarios..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cobertura Esperada (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.coberturaEsperada}
                onChange={(e) => handleChange('coberturaEsperada', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observaciones
              </label>
              <textarea
                value={form.observaciones}
                onChange={(e) => handleChange('observaciones', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {isEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resultados
                </label>
                <textarea
                  value={form.resultados}
                  onChange={(e) => handleChange('resultados', e.target.value)}
                  placeholder="Resultados de la actividad..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            )}
          </div>
        )}
      </form>
    </Modal>
  );
}
