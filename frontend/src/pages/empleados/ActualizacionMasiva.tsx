import { useState, useEffect, useCallback } from 'react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import api from '../../api/client'
import toast from 'react-hot-toast'
import { useTranslation } from '../../hooks/useTranslation'

interface Empleado {
  id: string; nombres: string; apellidos: string; numeroId: string
  cargo: string; estado: string
  sede?: { id: string; nombre: string }
}
interface Sede { id: string; nombre: string }

export default function ActualizacionMasiva() {
  const { t, te } = useTranslation()
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [sedes, setSedes] = useState<Sede[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [campo, setCampo] = useState('')
  const [valor, setValor] = useState('')
  const [applying, setApplying] = useState(false)

  const fetchEmpleados = useCallback(async () => {
    try {
      const res = await api.get('/empleados', { params: { limit: 500 } })
      setEmpleados(res.data.data)
    } catch { toast.error(t('errors.generic')) }
    finally { setLoading(false) }
  }, [t])

  useEffect(() => {
    fetchEmpleados()
    api.get('/sedes/all').then((r) => setSedes(r.data.data)).catch(() => {})
  }, [fetchEmpleados])

  const filtered = empleados.filter((e) =>
    `${e.nombres} ${e.apellidos} ${e.numeroId}`.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((e) => e.id)))
    }
  }

  const handleApply = async () => {
    if (!campo) { toast.error(t('errors.required')); return }
    if (!valor) { toast.error(t('errors.required')); return }
    if (selected.size === 0) { toast.error(t('errors.required')); return }
    setApplying(true)
    try {
      await api.put('/empleados/bulk-update', { ids: Array.from(selected), data: { [campo]: valor } })
      toast.success(t('success.updated'))
      setSelected(new Set())
      setCampo('')
      setValor('')
      fetchEmpleados()
    } catch { toast.error(t('errors.generic')) }
    finally { setApplying(false) }
  }

  return (
    <div className="p-6">
      <PageHeader
        title={t('modules.employees.bulkUpdate')}
        breadcrumbs={[
          { label: t('navigation.employees'), path: '/empleados' },
          { label: t('modules.employees.bulkUpdate') },
        ]}
      />

      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">{t('modules.employees.bulkUpdateConfig')}</h2>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="form-label">{t('modules.employees.fieldToUpdate')}</label>
            <select className="form-select" value={campo} onChange={(e) => { setCampo(e.target.value); setValor('') }}>
              <option value="">{t('modules.employees.selectField')}</option>
              <option value="estado">{t('common.status')}</option>
              <option value="sedeId">{t('common.headquarter')}</option>
              <option value="cargo">{t('common.position')}</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="form-label">{t('modules.employees.newValue')}</label>
            {campo === 'estado' && (
              <select className="form-select" value={valor} onChange={(e) => setValor(e.target.value)}>
                <option value="">{t('common.selectOption')}</option>
                <option value="ACTIVO">{te('employeeStatus', 'ACTIVO')}</option>
                <option value="INACTIVO">{te('employeeStatus', 'INACTIVO')}</option>
                <option value="VACACIONES">{te('employeeStatus', 'VACACIONES')}</option>
                <option value="INCAPACITADO">{te('employeeStatus', 'INCAPACITADO')}</option>
              </select>
            )}
            {campo === 'sedeId' && (
              <select className="form-select" value={valor} onChange={(e) => setValor(e.target.value)}>
                <option value="">{t('common.selectOption')}</option>
                {sedes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            )}
            {campo === 'cargo' && (
              <input className="form-input" placeholder={t('common.position')} value={valor}
                onChange={(e) => setValor(e.target.value)} />
            )}
            {!campo && <input className="form-input bg-gray-50" disabled placeholder="Primero seleccione un campo" />}
          </div>
          <button className="btn-primary" onClick={handleApply}
            disabled={selected.size === 0 || applying}>
            {applying ? t('modules.employees.applying') : t('modules.employees.applyTo', { count: selected.size })}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <input type="text" className="form-input w-64" placeholder={t('common.search') + '...'}
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <span className="text-sm text-gray-500">{selected.size} {t('modules.employees.selected')}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 w-10">
                <input type="checkbox" className="form-checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll} />
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-left">{t('modules.employees.idNumber')}</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-left">{t('common.name')}</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-left">{t('common.position')}</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-left">{t('common.headquarter')}</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-left">{t('common.status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">{t('common.loading')}</td></tr>
            )}
            {!loading && filtered.map((emp) => (
              <tr key={emp.id}
                className={`hover:bg-gray-50 transition-colors cursor-pointer ${selected.has(emp.id) ? 'bg-primary-50' : ''}`}
                onClick={() => toggle(emp.id)}
              >
                <td className="px-4 py-3">
                  <input type="checkbox" className="form-checkbox" checked={selected.has(emp.id)}
                    onChange={() => toggle(emp.id)} onClick={(e) => e.stopPropagation()} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{emp.numeroId}</td>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium">{emp.nombres} {emp.apellidos}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{emp.cargo}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{emp.sede?.nombre ?? '—'}</td>
                <td className="px-4 py-3 text-sm">
                  <StatusBadge active={emp.estado === 'ACTIVO'} />
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">{t('common.noResults')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
