import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import ActionButtons from '../../components/common/ActionButtons'
import ConfirmModal from '../../components/common/ConfirmModal'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import { empleadosApi } from '../../api/empleados.api'
import toast from 'react-hot-toast'
import { useTranslation } from '../../hooks/useTranslation'

interface Empleado {
  id: string; tipoId: string; numeroId: string; nombres: string; apellidos: string
  cargo?: string; estado: string
  sede?: { id: string; nombre: string }
  contratista?: { id: string; nombre: string }
  centroCosto?: { id: string; nombre: string }
  eps?: string; fondoPensiones?: string; arl?: string
  contactoEmergencia?: string; telefonoEmergencia?: string
  email?: string; telefono?: string; fechaIngreso?: string; salario?: number
}

export default function ListaEmpleados() {
  const navigate = useNavigate()
  const { t, te } = useTranslation()
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Empleado | null>(null)
  const [modal, setModal] = useState<'view' | null>(null)
  const [confirm, setConfirm] = useState(false)

  const fetchEmpleados = useCallback(async () => {
    try {
      const res = await empleadosApi.list()
      setEmpleados(res.data.data)
    } catch { toast.error(t('errors.generic')) }
    finally { setLoading(false) }
  }, [t])

  useEffect(() => { fetchEmpleados() }, [fetchEmpleados])

  const filtered = empleados.filter((e) =>
    `${e.nombres} ${e.apellidos} ${e.numeroId} ${e.cargo}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    if (!selected) return
    try {
      await empleadosApi.remove(selected.id)
      toast.success(t('success.deleted'))
      setConfirm(false); setSelected(null); fetchEmpleados()
    } catch { toast.error(t('errors.generic')) }
  }

  return (
    <div className="p-6">
      <PageHeader
        title={t('modules.employees.list')}
        breadcrumbs={[
          { label: t('navigation.employees') },
          { label: t('modules.employees.list') },
        ]}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <input
          type="text"
          className="form-input w-64"
          placeholder={t('common.search') + '...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-primary whitespace-nowrap" onClick={() => navigate('/empleados/agregar')}>
          {t('modules.employees.add')}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="table-dark w-full">
          <thead>
            <tr>
              <th className="text-left">{t('modules.employees.idType')}</th>
              <th className="text-left">{t('modules.employees.idNumber')}</th>
              <th className="text-left">{t('modules.employees.firstName')}</th>
              <th className="text-left">{t('modules.employees.lastName')}</th>
              <th className="text-left">{t('common.position')}</th>
              <th className="text-left">{t('common.headquarter')}</th>
              <th className="text-left w-28">{t('common.status')}</th>
              <th className="text-left w-24">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                  {t('common.loading')}
                </td>
              </tr>
            )}
            {!loading && filtered.map((emp) => (
              <tr key={emp.id}>
                <td className="text-sm text-gray-600 dark:text-gray-400">{emp.tipoId}</td>
                <td className="text-sm text-gray-700 dark:text-gray-300">{emp.numeroId}</td>
                <td className="text-sm text-gray-800 dark:text-gray-100 font-medium">{emp.nombres}</td>
                <td className="text-sm text-gray-800 dark:text-gray-100">{emp.apellidos}</td>
                <td className="text-sm text-gray-600 dark:text-gray-400">{emp.cargo}</td>
                <td className="text-sm text-gray-600 dark:text-gray-400">{emp.sede?.nombre ?? '—'}</td>
                <td className="text-sm">
                  <StatusBadge
                    active={emp.estado === 'ACTIVO'}
                    activeLabel={te('employeeStatus', emp.estado)}
                    inactiveLabel={te('employeeStatus', emp.estado)}
                  />
                </td>
                <td>
                  <ActionButtons
                    onView={() => { setSelected(emp); setModal('view') }}
                    onEdit={() => navigate(`/empleados/editar/${emp.id}`)}
                    onDelete={() => { setSelected(emp); setConfirm(true) }}
                  />
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                  {t('common.noResults')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title={t('modules.employees.detail')} size="lg">
        {selected && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Detail label={t('modules.employees.idType')} value={selected.tipoId} />
            <Detail label={t('modules.employees.idNumber')} value={selected.numeroId} />
            <Detail label={t('modules.employees.firstName')} value={selected.nombres} />
            <Detail label={t('modules.employees.lastName')} value={selected.apellidos} />
            <Detail label={t('common.email')} value={selected.email} />
            <Detail label={t('common.phone')} value={selected.telefono} />
            <Detail label={t('common.position')} value={selected.cargo} />
            <Detail label={t('common.status')} value={te('employeeStatus', selected.estado)} />
            <Detail label={t('modules.employees.hireDate')} value={selected.fechaIngreso ?? '—'} />
            <Detail label={t('modules.employees.salary')} value={selected.salario ? `$${selected.salario.toLocaleString()}` : '—'} />
            <Detail label={t('common.headquarter')} value={selected.sede?.nombre ?? '—'} />
            <Detail label={t('modules.employees.contractor')} value={selected.contratista?.nombre ?? '—'} />
            <Detail label={t('modules.employees.costCenter')} value={selected.centroCosto?.nombre ?? '—'} />
            <Detail label={t('modules.employees.eps')} value={selected.eps} />
            <Detail label={t('modules.employees.pensionFund')} value={selected.fondoPensiones} />
            <Detail label={t('modules.employees.arl')} value={selected.arl} />
            <Detail label={t('modules.employees.emergencyContact')} value={selected.contactoEmergencia} />
            <Detail label={t('modules.employees.emergencyPhone')} value={selected.telefonoEmergencia} />
          </div>
        )}
      </Modal>

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={confirm}
        onClose={() => { setConfirm(false); setSelected(null) }}
        onConfirm={handleDelete}
        message={t('common.confirmDeleteItem', { name: (selected?.nombres ?? '') + ' ' + (selected?.apellidos ?? '') })}
      />
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase">{label}</p>
      <p className="text-sm text-gray-800 mt-0.5">{value || '—'}</p>
    </div>
  )
}
