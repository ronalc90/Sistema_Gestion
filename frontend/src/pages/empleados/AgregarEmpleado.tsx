import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import { empleadosApi } from '../../api/empleados.api'
import api from '../../api/client'
import toast from 'react-hot-toast'
import { useTranslation } from '../../hooks/useTranslation'

interface EmpleadoForm {
  tipoId: string
  numeroId: string
  nombres: string
  apellidos: string
  email: string
  telefono: string
  fechaNacimiento: string
  genero: string
  direccion: string
  cargo: string
  fechaIngreso: string
  salario: string
  estado: string
  eps: string
  fondoPensiones: string
  arl: string
  contactoEmergencia: string
  telefonoEmergencia: string
  sedeId: string
  contratistaId: string
  centroCostoId: string
}

interface Sede { id: string; nombre: string }
interface Contratista { id: string; nombre: string }
interface CentroCosto { id: string; codigo: string; nombre: string }

const defaultForm: EmpleadoForm = {
  tipoId: 'CC', numeroId: '', nombres: '', apellidos: '', email: '', telefono: '',
  fechaNacimiento: '', genero: 'MASCULINO', direccion: '', cargo: '', fechaIngreso: '',
  salario: '', estado: 'ACTIVO', eps: '', fondoPensiones: '', arl: '',
  contactoEmergencia: '', telefonoEmergencia: '', sedeId: '', contratistaId: '', centroCostoId: '',
}

export default function AgregarEmpleado() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const isEdit = Boolean(id)
  const { t, te } = useTranslation()

  const [form, setForm] = useState<EmpleadoForm>(defaultForm)
  const [errors, setErrors] = useState<Partial<EmpleadoForm>>({})
  const [sedes, setSedes] = useState<Sede[]>([])
  const [contratistas, setContratistas] = useState<Contratista[]>([])
  const [centrosCosto, setCentrosCosto] = useState<CentroCosto[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/sedes/all'),
      api.get('/contratistas/all'),
      api.get('/centros-costo/all'),
    ]).then(([s, c, cc]) => {
      setSedes(s.data.data)
      setContratistas(c.data.data)
      setCentrosCosto(cc.data.data)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (isEdit && id) {
      empleadosApi.getById(id).then((res) => {
        const emp = res.data.data
        setForm({
          tipoId: emp.tipoId, numeroId: emp.numeroId, nombres: emp.nombres,
          apellidos: emp.apellidos, email: emp.email ?? '', telefono: emp.telefono ?? '',
          fechaNacimiento: emp.fechaNacimiento ? emp.fechaNacimiento.slice(0, 10) : '',
          genero: emp.genero ?? 'MASCULINO', direccion: emp.direccion ?? '',
          cargo: emp.cargo ?? '', fechaIngreso: emp.fechaIngreso ? emp.fechaIngreso.slice(0, 10) : '',
          salario: String(emp.salario ?? ''), estado: emp.estado,
          eps: emp.eps ?? '', fondoPensiones: emp.fondoPensiones ?? '', arl: emp.arl ?? '',
          contactoEmergencia: emp.contactoEmergencia ?? '',
          telefonoEmergencia: emp.telefonoEmergencia ?? '',
          sedeId: emp.sedeId, contratistaId: emp.contratistaId ?? '',
          centroCostoId: emp.centroCostoId ?? '',
        })
      }).catch(() => toast.error(t('errors.generic')))
    }
  }, [id, isEdit, t])

  const set = (field: keyof EmpleadoForm, value: string) =>
    setForm((p) => ({ ...p, [field]: value }))

  const validate = (): boolean => {
    const e: Partial<EmpleadoForm> = {}
    if (!form.numeroId.trim()) e.numeroId = t('errors.required')
    if (!form.nombres.trim()) e.nombres = t('errors.required')
    if (!form.apellidos.trim()) e.apellidos = t('errors.required')
    if (!form.cargo.trim()) e.cargo = t('errors.required')
    if (!form.sedeId) e.sedeId = t('errors.required')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        salario: form.salario ? Number(form.salario) : undefined,
        fechaNacimiento: form.fechaNacimiento || undefined,
        fechaIngreso: form.fechaIngreso || undefined,
        contratistaId: form.contratistaId || undefined,
        centroCostoId: form.centroCostoId || undefined,
        email: form.email || undefined,
        telefono: form.telefono || undefined,
        direccion: form.direccion || undefined,
      }
      if (isEdit && id) {
        await empleadosApi.update(id, payload)
      } else {
        await empleadosApi.create(payload)
      }
      toast.success(t('success.saved'))
      navigate('/empleados')
    } catch {
      toast.error(t('errors.generic'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader
        title={isEdit ? t('modules.employees.edit') : t('modules.employees.add')}
        breadcrumbs={[
          { label: t('navigation.employees'), path: '/empleados' },
          { label: isEdit ? t('modules.employees.edit') : t('modules.employees.add') },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identificación */}
        <section className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">{t('modules.employees.sectionId')}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">{t('modules.employees.idType')}</label>
              <select className="form-select" value={form.tipoId} onChange={(e) => set('tipoId', e.target.value)}>
                <option value="CC">{te('idType', 'CC')}</option>
                <option value="CE">{te('idType', 'CE')}</option>
                <option value="PASAPORTE">{te('idType', 'PASAPORTE')}</option>
                <option value="NIT">{te('idType', 'NIT')}</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="form-label">{t('modules.employees.idNumber')} <span className="text-red-500">*</span></label>
              <input className={`form-input ${errors.numeroId ? 'border-red-400' : ''}`}
                value={form.numeroId} onChange={(e) => set('numeroId', e.target.value)} />
              {errors.numeroId && <p className="text-xs text-red-500 mt-1">{errors.numeroId}</p>}
            </div>
            <div>
              <label className="form-label">{t('modules.employees.firstName')} <span className="text-red-500">*</span></label>
              <input className={`form-input ${errors.nombres ? 'border-red-400' : ''}`}
                value={form.nombres} onChange={(e) => set('nombres', e.target.value)} />
              {errors.nombres && <p className="text-xs text-red-500 mt-1">{errors.nombres}</p>}
            </div>
            <div>
              <label className="form-label">{t('modules.employees.lastName')} <span className="text-red-500">*</span></label>
              <input className={`form-input ${errors.apellidos ? 'border-red-400' : ''}`}
                value={form.apellidos} onChange={(e) => set('apellidos', e.target.value)} />
              {errors.apellidos && <p className="text-xs text-red-500 mt-1">{errors.apellidos}</p>}
            </div>
            <div>
              <label className="form-label">{t('modules.employees.gender')}</label>
              <select className="form-select" value={form.genero} onChange={(e) => set('genero', e.target.value)}>
                <option value="MASCULINO">{te('gender', 'MASCULINO')}</option>
                <option value="FEMENINO">{te('gender', 'FEMENINO')}</option>
                <option value="OTRO">{te('gender', 'OTRO')}</option>
              </select>
            </div>
            <div>
              <label className="form-label">{t('modules.employees.birthDate')}</label>
              <input type="date" className="form-input" value={form.fechaNacimiento}
                onChange={(e) => set('fechaNacimiento', e.target.value)} />
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">{t('modules.employees.sectionContact')}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">{t('common.email')}</label>
              <input type="email" className="form-input" value={form.email}
                onChange={(e) => set('email', e.target.value)} />
            </div>
            <div>
              <label className="form-label">{t('common.phone')}</label>
              <input className="form-input" value={form.telefono}
                onChange={(e) => set('telefono', e.target.value)} />
            </div>
            <div>
              <label className="form-label">{t('common.address')}</label>
              <input className="form-input" value={form.direccion}
                onChange={(e) => set('direccion', e.target.value)} />
            </div>
            <div>
              <label className="form-label">{t('modules.employees.emergencyContact')}</label>
              <input className="form-input" value={form.contactoEmergencia}
                onChange={(e) => set('contactoEmergencia', e.target.value)} />
            </div>
            <div>
              <label className="form-label">{t('modules.employees.emergencyPhone')}</label>
              <input className="form-input" value={form.telefonoEmergencia}
                onChange={(e) => set('telefonoEmergencia', e.target.value)} />
            </div>
          </div>
        </section>

        {/* Laboral */}
        <section className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">{t('modules.employees.sectionWork')}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">{t('common.position')} <span className="text-red-500">*</span></label>
              <input className={`form-input ${errors.cargo ? 'border-red-400' : ''}`}
                value={form.cargo} onChange={(e) => set('cargo', e.target.value)} />
              {errors.cargo && <p className="text-xs text-red-500 mt-1">{errors.cargo}</p>}
            </div>
            <div>
              <label className="form-label">{t('modules.employees.hireDate')}</label>
              <input type="date" className="form-input" value={form.fechaIngreso}
                onChange={(e) => set('fechaIngreso', e.target.value)} />
            </div>
            <div>
              <label className="form-label">{t('modules.employees.salary')}</label>
              <input type="number" className="form-input" value={form.salario}
                onChange={(e) => set('salario', e.target.value)} />
            </div>
            <div>
              <label className="form-label">{t('common.status')}</label>
              <select className="form-select" value={form.estado} onChange={(e) => set('estado', e.target.value)}>
                <option value="ACTIVO">{te('employeeStatus', 'ACTIVO')}</option>
                <option value="INACTIVO">{te('employeeStatus', 'INACTIVO')}</option>
                <option value="VACACIONES">{te('employeeStatus', 'VACACIONES')}</option>
                <option value="INCAPACITADO">{te('employeeStatus', 'INCAPACITADO')}</option>
              </select>
            </div>
            <div>
              <label className="form-label">{t('common.headquarter')} <span className="text-red-500">*</span></label>
              <select className={`form-select ${errors.sedeId ? 'border-red-400' : ''}`}
                value={form.sedeId} onChange={(e) => set('sedeId', e.target.value)}>
                <option value="">{t('common.selectOption')}</option>
                {sedes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
              {errors.sedeId && <p className="text-xs text-red-500 mt-1">{errors.sedeId}</p>}
            </div>
            <div>
              <label className="form-label">{t('modules.employees.contractor')}</label>
              <select className="form-select" value={form.contratistaId}
                onChange={(e) => set('contratistaId', e.target.value)}>
                <option value="">{t('modules.employees.nContractor')}</option>
                {contratistas.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">{t('modules.employees.costCenter')}</label>
              <select className="form-select" value={form.centroCostoId}
                onChange={(e) => set('centroCostoId', e.target.value)}>
                <option value="">{t('modules.employees.nCostCenter')}</option>
                {centrosCosto.map((cc) => <option key={cc.id} value={cc.id}>{cc.codigo} – {cc.nombre}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Seguridad social */}
        <section className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">{t('modules.employees.sectionSocial')}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">{t('modules.employees.eps')}</label>
              <input className="form-input" value={form.eps}
                onChange={(e) => set('eps', e.target.value)} />
            </div>
            <div>
              <label className="form-label">{t('modules.employees.pensionFund')}</label>
              <input className="form-input" value={form.fondoPensiones}
                onChange={(e) => set('fondoPensiones', e.target.value)} />
            </div>
            <div>
              <label className="form-label">{t('modules.employees.arl')}</label>
              <input className="form-input" value={form.arl}
                onChange={(e) => set('arl', e.target.value)} />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="submit" className="btn-primary px-8" disabled={submitting}>
            {submitting ? t('common.saving') : t('common.save')}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/empleados')}>{t('common.cancel')}</button>
        </div>
      </form>
    </div>
  )
}
