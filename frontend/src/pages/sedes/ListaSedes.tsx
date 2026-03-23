import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import ActionButtons from '../../components/common/ActionButtons'
import ConfirmModal from '../../components/common/ConfirmModal'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import { sedesApi } from '../../api/sedes.api'
import toast from 'react-hot-toast'

interface Sede {
  id: string
  nombre: string
  estado: 'ACTIVO' | 'INACTIVO'
  tiempoDescanso?: string
  fechaInicial?: string
  fechaFinal?: string
  nombreColeccion?: string
  centroCosto?: { id: string; nombre: string; codigo: string }
  horarios?: Array<{ dia: string; activo: boolean; horaInicio?: string; horaFin?: string }>
  _count?: { empleados: number }
}

export default function ListaSedes() {
  const navigate = useNavigate()
  const [sedes, setSedes] = useState<Sede[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Sede | null>(null)
  const [modal, setModal] = useState<'view' | 'delete' | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchSedes = useCallback(async () => {
    try {
      setLoading(true)
      const res = await sedesApi.list()
      if (res.data?.success) {
        setSedes(res.data.data || [])
      } else {
        toast.error('Error al cargar las sedes')
      }
    } catch (error: any) {
      console.error('Error fetching sedes:', error)
      toast.error(error?.response?.data?.message || 'Error al cargar las sedes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { 
    fetchSedes() 
  }, [fetchSedes])

  const filtered = sedes.filter((s) =>
    s.nombre.toLowerCase().includes(search.toLowerCase())
  )

  const handleView = (sede: Sede) => {
    setSelected(sede)
    setModal('view')
  }

  const handleEdit = (sede: Sede) => {
    navigate(`/sedes/editar/${sede.id}`)
  }

  const handleDeleteClick = (sede: Sede) => {
    setSelected(sede)
    setModal('delete')
  }

  const handleDelete = async () => {
    if (!selected) return
    
    setDeleting(true)
    try {
      const res = await sedesApi.remove(selected.id)
      if (res.data?.success) {
        toast.success('Sede eliminada exitosamente')
        setModal(null)
        setSelected(null)
        fetchSedes()
      } else {
        toast.error(res.data?.message || 'Error al eliminar la sede')
      }
    } catch (error: any) {
      console.error('Error deleting sede:', error)
      const message = error?.response?.data?.message || 'Error al eliminar la sede'
      toast.error(message)
    } finally {
      setDeleting(false)
    }
  }

  const handleCloseModal = () => {
    setModal(null)
    setSelected(null)
  }

  const handleAddSede = () => {
    navigate('/sedes/agregar')
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Lista de Sedes"
        breadcrumbs={[
          { label: 'Gestionar Sedes', path: '/sedes' },
          { label: 'Lista de Sedes' },
        ]}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-end gap-3 mb-4">
        <input
          type="text"
          className="form-input w-52"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button 
          type="button"
          className="btn-primary whitespace-nowrap" 
          onClick={handleAddSede}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Sede
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="table-dark w-full">
          <thead>
            <tr>
              <th className="text-left">Nombre</th>
              <th className="text-left w-44">Centro costos</th>
              <th className="text-left w-28">Estado</th>
              <th className="text-left w-24">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Cargando...
                  </div>
                </td>
              </tr>
            )}
            {!loading && filtered.map((sede) => (
              <tr key={sede.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="text-sm text-gray-800 dark:text-gray-100 font-medium">{sede.nombre}</td>
                <td className="text-sm text-gray-600 dark:text-gray-400">{sede.centroCosto?.nombre ?? '—'}</td>
                <td className="text-sm">
                  <StatusBadge active={sede.estado === 'ACTIVO'} />
                </td>
                <td>
                  <ActionButtons
                    onView={() => handleView(sede)}
                    onEdit={() => handleEdit(sede)}
                    onDelete={() => handleDeleteClick(sede)}
                  />
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                  {search ? 'No se encontraron sedes con ese nombre' : 'No hay sedes registradas'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      <Modal 
        isOpen={modal === 'view'} 
        onClose={handleCloseModal} 
        title="Detalle de Sede" 
        size="lg"
      >
        {selected && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Detail label="Nombre" value={selected.nombre} />
            <Detail label="Estado" value={selected.estado} />
            <Detail label="Centro de costos" value={selected.centroCosto?.nombre ?? '—'} />
            <Detail label="Nombre colección" value={selected.nombreColeccion ?? '—'} />
            <Detail label="Tiempo descanso" value={selected.tiempoDescanso ? `${selected.tiempoDescanso} horas` : '—'} />
            <Detail label="Fecha inicial" value={selected.fechaInicial ? selected.fechaInicial.slice(0, 10) : '—'} />
            <Detail label="Fecha final" value={selected.fechaFinal ? selected.fechaFinal.slice(0, 10) : '—'} />
            {selected.horarios && selected.horarios.length > 0 && (
              <div className="col-span-2 mt-2">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Horarios</p>
                <div className="grid grid-cols-4 gap-2">
                  {selected.horarios.map((h) => (
                    <div key={h.dia} className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                      <p className="text-xs font-medium capitalize text-gray-700 dark:text-gray-300">{h.dia.toLowerCase()}</p>
                      {h.activo ? (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{h.horaInicio} – {h.horaFin}</p>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Sin horario</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selected._count && (
              <div className="col-span-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500">
                  Empleados asignados: <span className="font-medium">{selected._count.empleados}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={modal === 'delete'}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro que desea eliminar la sede "${selected?.nombre}"? Esta acción no se puede deshacer.`}
      />
      
      {/* Loading overlay for delete */}
      {deleting && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-3 shadow-lg">
            <svg className="animate-spin h-5 w-5 text-primary-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-sm text-gray-700 dark:text-gray-300">Eliminando...</span>
          </div>
        </div>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase">{label}</p>
      <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{value || '—'}</p>
    </div>
  )
}
