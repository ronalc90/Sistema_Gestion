import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'

import { sedesApi } from '../../api/sedes.api'
import api from '../../api/client'
import toast from 'react-hot-toast'
import { useTranslation } from '../../hooks/useTranslation'

interface HorarioDia { inicio: string; fin: string; activo: boolean }

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const
const DIAS_LABEL: Record<string, string> = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
  jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo',
}
const DIA_TO_API: Record<string, string> = {
  lunes: 'LUNES', martes: 'MARTES', miercoles: 'MIERCOLES',
  jueves: 'JUEVES', viernes: 'VIERNES', sabado: 'SABADO', domingo: 'DOMINGO',
}
const API_TO_DIA: Record<string, string> = Object.fromEntries(
  Object.entries(DIA_TO_API).map(([k, v]) => [v, k])
)

const defaultHorarios: Record<string, HorarioDia> = {
  lunes:    { inicio: '07:00', fin: '17:00', activo: true },
  martes:   { inicio: '07:00', fin: '17:00', activo: true },
  miercoles:{ inicio: '07:00', fin: '17:00', activo: true },
  jueves:   { inicio: '07:00', fin: '17:00', activo: true },
  viernes:  { inicio: '07:00', fin: '17:00', activo: true },
  sabado:   { inicio: '08:00', fin: '13:00', activo: false },
  domingo:  { inicio: '',      fin: '',      activo: false },
}

interface FormData {
  nombre: string
  tiempoDescanso: string
  fechaInicial: string
  fechaFinal: string
  estado: 'ACTIVO' | 'INACTIVO'
  nombreColeccion: string
  centroCostoId: string
  horarios: Record<string, HorarioDia>
}

const defaultForm: FormData = {
  nombre: '',
  tiempoDescanso: '1',
  fechaInicial: '',
  fechaFinal: '',
  estado: 'ACTIVO',
  nombreColeccion: '',
  centroCostoId: '',
  horarios: defaultHorarios,
}

interface CentroCosto { id: string; codigo: string; nombre: string }

export default function FormSede() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const { t } = useTranslation()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<FormData>(defaultForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | string, string>>>({})
  const [centrosCosto, setCentrosCosto] = useState<CentroCosto[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  const TIEMPOS_DESCANSO = [
    { value: '0.5', label: t('modules.headquarters.restTimeOptions.30min') },
    { value: '1', label: t('modules.headquarters.restTimeOptions.1h') },
    { value: '1.5', label: t('modules.headquarters.restTimeOptions.1h30') },
    { value: '2', label: t('modules.headquarters.restTimeOptions.2h') },
  ]

  // Load cost centers
  useEffect(() => {
    api.get('/centros-costo/all')
      .then((res) => {
        if (res.data?.success) {
          setCentrosCosto(res.data.data || [])
        }
      })
      .catch((err) => {
        console.error('Error loading centros de costo:', err)
        toast.error(t('errors.generic'))
      })
  }, [t])

  // Load sede data in edit mode
  useEffect(() => {
    if (isEdit && id) {
      setLoading(true)
      sedesApi.getById(id)
        .then((res) => {
          if (res.data?.success) {
            const s = res.data.data
            const horarios = { ...defaultHorarios }
            if (s.horarios) {
              s.horarios.forEach((h: { dia: string; activo: boolean; horaInicio?: string; horaFin?: string }) => {
                const dia = API_TO_DIA[h.dia]
                if (dia) {
                  horarios[dia] = {
                    activo: h.activo,
                    inicio: h.horaInicio ?? '',
                    fin: h.horaFin ?? ''
                  }
                }
              })
            }
            setForm({
              nombre: s.nombre || '',
              tiempoDescanso: s.tiempoDescanso || '1',
              fechaInicial: s.fechaInicial ? s.fechaInicial.slice(0, 10) : '',
              fechaFinal: s.fechaFinal ? s.fechaFinal.slice(0, 10) : '',
              estado: s.estado || 'ACTIVO',
              nombreColeccion: s.nombreColeccion || '',
              centroCostoId: s.centroCostoId || '',
              horarios,
            })
          } else {
            toast.error(t('errors.generic'))
          }
        })
        .catch((err) => {
          console.error('Error loading sede:', err)
          toast.error(t('errors.generic'))
        })
        .finally(() => setLoading(false))
    }
  }, [id, isEdit, t])

  const set = (field: keyof FormData, value: string) => {
    setForm((p) => ({ ...p, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const setHorario = (dia: string, field: keyof HorarioDia, value: string | boolean) => {
    setForm((p) => ({
      ...p,
      horarios: { ...p.horarios, [dia]: { ...p.horarios[dia], [field]: value } },
    }))
  }

  const validate = (): boolean => {
    const e: Partial<Record<string, string>> = {}

    if (!form.nombre.trim()) {
      e.nombre = t('errors.required')
    } else if (form.nombre.trim().length < 3) {
      e.nombre = t('errors.minLength', { count: '3' })
    }

    if (!form.fechaInicial) {
      e.fechaInicial = t('errors.required')
    }

    if (!form.fechaFinal) {
      e.fechaFinal = t('errors.required')
    }

    if (form.fechaInicial && form.fechaFinal) {
      const fechaInicial = new Date(form.fechaInicial)
      const fechaFinal = new Date(form.fechaFinal)
      if (fechaFinal < fechaInicial) {
        e.fechaFinal = t('errors.dateRange')
      }
    }

    if (!form.estado) {
      e.estado = t('errors.required')
    }

    if (!form.nombreColeccion.trim()) {
      e.nombreColeccion = t('errors.required')
    } else if (form.nombreColeccion.trim().length < 4) {
      e.nombreColeccion = t('errors.minLength', { count: '4' })
    }

    const diasActivos = DIAS.filter(dia => form.horarios[dia].activo)
    if (diasActivos.length === 0) {
      e.horarios = t('errors.atLeastOneDay')
    }

    diasActivos.forEach(dia => {
      const h = form.horarios[dia]
      if (!h.inicio || !h.fin) {
        e[`horario_${dia}`] = t('errors.required')
      } else if (h.inicio >= h.fin) {
        e[`horario_${dia}`] = t('errors.dateRange')
      }
    })

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      toast.error(t('errors.fixFormErrors'))
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        nombre: form.nombre.trim(),
        estado: form.estado,
        tiempoDescanso: form.tiempoDescanso,
        fechaInicial: form.fechaInicial || undefined,
        fechaFinal: form.fechaFinal || undefined,
        nombreColeccion: form.nombreColeccion.trim(),
        centroCostoId: form.centroCostoId || undefined,
        horarios: DIAS.map((dia) => ({
          dia: DIA_TO_API[dia],
          activo: form.horarios[dia].activo,
          horaInicio: form.horarios[dia].inicio || undefined,
          horaFin: form.horarios[dia].fin || undefined,
        })),
      }

      let res
      if (isEdit && id) {
        res = await sedesApi.update(id, payload)
      } else {
        res = await sedesApi.create(payload)
      }

      if (res.data?.success) {
        toast.success(isEdit ? t('success.updated') : t('success.saved'))
        navigate('/sedes')
      } else {
        toast.error(res.data?.message || t('errors.generic'))
      }
    } catch (error: any) {
      console.error('Error saving sede:', error)
      toast.error(error?.response?.data?.message || t('errors.generic'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/sedes')
  }

  const breadcrumbs = [
    { label: t('navigation.headquarters'), path: '/sedes' },
    { label: isEdit ? t('modules.headquarters.edit') : t('modules.headquarters.add') },
  ]

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span>{t('common.loading')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <PageHeader
        title={isEdit ? t('modules.headquarters.edit') : t('modules.headquarters.add')}
        breadcrumbs={breadcrumbs}
      />

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Card: General Data ── */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {t('modules.headquarters.generalData')}
            </h2>
          </div>
          <div className="p-6 grid grid-cols-3 gap-x-6 gap-y-4">

            {/* Name */}
            <div className="col-span-3">
              <label className="form-label">
                {t('modules.headquarters.nameLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.nombre ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                placeholder={t('modules.headquarters.nameLabel')}
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                disabled={submitting}
              />
              {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
            </div>

            {/* Rest time */}
            <div>
              <label className="form-label">
                {t('modules.headquarters.restTime')} <span className="text-red-500">*</span>
              </label>
              <select
                className="form-select"
                value={form.tiempoDescanso}
                onChange={(e) => set('tiempoDescanso', e.target.value)}
                disabled={submitting}
              >
                <option value="">{t('modules.headquarters.selectRestTime')}</option>
                {TIEMPOS_DESCANSO.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="form-label">
                {t('modules.headquarters.statusLabel')} <span className="text-red-500">*</span>
              </label>
              <select
                className={`form-select ${errors.estado ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                value={form.estado}
                onChange={(e) => set('estado', e.target.value as 'ACTIVO' | 'INACTIVO')}
                disabled={submitting}
              >
                <option value="">{t('common.selectOption')}</option>
                <option value="ACTIVO">{t('common.active')}</option>
                <option value="INACTIVO">{t('common.inactive')}</option>
              </select>
              {errors.estado && <p className="text-xs text-red-500 mt-1">{errors.estado}</p>}
            </div>

            {/* Cost center */}
            <div>
              <label className="form-label">{t('common.costCenter')}</label>
              <select
                className="form-select"
                value={form.centroCostoId}
                onChange={(e) => set('centroCostoId', e.target.value)}
                disabled={submitting}
              >
                <option value="">{t('modules.headquarters.noCostCenter')}</option>
                {centrosCosto.map((cc) => (
                  <option key={cc.id} value={cc.id}>
                    {cc.codigo} – {cc.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Initial date */}
            <div>
              <label className="form-label">
                {t('modules.headquarters.initialDate')} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`form-input ${errors.fechaInicial ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                value={form.fechaInicial}
                onChange={(e) => set('fechaInicial', e.target.value)}
                disabled={submitting}
              />
              {errors.fechaInicial && <p className="text-xs text-red-500 mt-1">{errors.fechaInicial}</p>}
            </div>

            {/* Final date */}
            <div>
              <label className="form-label">
                {t('modules.headquarters.finalDate')} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`form-input ${errors.fechaFinal ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                value={form.fechaFinal}
                min={form.fechaInicial}
                onChange={(e) => set('fechaFinal', e.target.value)}
                disabled={submitting}
              />
              {errors.fechaFinal && <p className="text-xs text-red-500 mt-1">{errors.fechaFinal}</p>}
            </div>

            {/* Collection name */}
            <div>
              <label className="form-label">
                {t('modules.headquarters.collectionName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.nombreColeccion ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                placeholder={t('modules.headquarters.collectionHint')}
                value={form.nombreColeccion}
                onChange={(e) => set('nombreColeccion', e.target.value)}
                disabled={submitting}
              />
              <p className="text-xs text-gray-400 mt-1">{t('errors.minLength', { count: '4' })}.</p>
              {errors.nombreColeccion && <p className="text-xs text-red-500 mt-1">{errors.nombreColeccion}</p>}
            </div>

          </div>
        </div>

        {/* ── Card: Schedules ── */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {t('modules.headquarters.schedules')}
            </h2>
            {errors.horarios && (
              <p className="text-xs text-red-500">{errors.horarios}</p>
            )}
          </div>
          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-8"></th>
                  <th className="pb-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-32">{t('common.date')}</th>
                  <th className="pb-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('modules.headquarters.initialDate')}</th>
                  <th className="pb-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('modules.headquarters.finalDate')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {DIAS.map((dia) => {
                  const h = form.horarios[dia]
                  const errorKey = `horario_${dia}`
                  return (
                    <tr key={dia} className={!h.activo ? 'opacity-50' : ''}>
                      <td className="py-2 pr-3">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={h.activo}
                          disabled={submitting}
                          onChange={(e) => setHorario(dia, 'activo', e.target.checked)}
                        />
                      </td>
                      <td className="py-2 font-medium text-gray-700 dark:text-gray-300">
                        {DIAS_LABEL[dia]}
                      </td>
                      <td className="py-2 pr-4">
                        <input
                          type="time"
                          className={`form-input py-1 text-sm w-36 ${errors[errorKey] ? 'border-red-400' : ''}`}
                          value={h.inicio}
                          disabled={!h.activo || submitting}
                          onChange={(e) => setHorario(dia, 'inicio', e.target.value)}
                        />
                      </td>
                      <td className="py-2">
                        <input
                          type="time"
                          className={`form-input py-1 text-sm w-36 ${errors[errorKey] ? 'border-red-400' : ''}`}
                          value={h.fin}
                          disabled={!h.activo || submitting}
                          onChange={(e) => setHorario(dia, 'fin', e.target.value)}
                        />
                        {errors[errorKey] && (
                          <p className="text-xs text-red-500 mt-0.5">{errors[errorKey]}</p>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Buttons ── */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="btn-primary px-8 flex items-center gap-2"
            disabled={submitting}
          >
            {submitting && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {submitting ? t('common.saving') : t('common.save')}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCancel}
            disabled={submitting}
          >
            {t('common.cancel')}
          </button>
        </div>

      </form>
    </div>
  )
}
