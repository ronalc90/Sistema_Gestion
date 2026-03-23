import { useState, useEffect, useCallback } from 'react'
import { usersApi, CreateUserData, UpdateUserData } from '../../api/users.api'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'
import type { User, RolUsuario, EstadoUsuario } from '../../types'

const ROL_LABELS: Record<RolUsuario, string> = {
  ADMIN_TOTAL: 'Super Admin',
  ADMIN: 'Administrador',
  SUPERVISOR: 'Supervisor',
  USUARIO: 'Usuario',
}

const ESTADO_LABELS: Record<EstadoUsuario, string> = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
  BLOQUEADO: 'Bloqueado',
}

const ESTADO_COLORS: Record<EstadoUsuario, string> = {
  ACTIVO: 'bg-green-100 text-green-800',
  INACTIVO: 'bg-gray-100 text-gray-700',
  BLOQUEADO: 'bg-red-100 text-red-700',
}

const ROL_COLORS: Record<RolUsuario, string> = {
  ADMIN_TOTAL: 'bg-purple-100 text-purple-800',
  ADMIN: 'bg-blue-100 text-blue-800',
  SUPERVISOR: 'bg-yellow-100 text-yellow-800',
  USUARIO: 'bg-gray-100 text-gray-700',
}

interface UserFormData {
  nombre: string
  email: string
  password: string
  rol: RolUsuario
  estado: EstadoUsuario
}

const defaultForm: UserFormData = {
  nombre: '',
  email: '',
  password: '',
  rol: 'USUARIO',
  estado: 'ACTIVO',
}

export default function GestionUsuarios() {
  const currentUser = useAuthStore((s) => s.user)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [form, setForm] = useState<UserFormData>(defaultForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<User | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await usersApi.list({ page, limit: 10, search: search || undefined })
      setUsers(res.data)
      setTotalPages(res.meta.totalPages)
      setTotal(res.meta.total)
    } catch {
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    const timer = setTimeout(fetchUsers, search ? 400 : 0)
    return () => clearTimeout(timer)
  }, [fetchUsers, search])

  const openCreate = () => {
    setEditing(null)
    setForm(defaultForm)
    setShowModal(true)
  }

  const openEdit = (user: User) => {
    setEditing(user)
    setForm({
      nombre: user.nombre,
      email: user.email,
      password: '',
      rol: user.rol,
      estado: user.estado,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.nombre.trim() || !form.email.trim()) {
      toast.error('Nombre y email son requeridos')
      return
    }
    if (!editing && !form.password.trim()) {
      toast.error('La contraseña es requerida para nuevos usuarios')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        const data: UpdateUserData = {
          nombre: form.nombre,
          email: form.email,
          rol: form.rol,
          estado: form.estado,
          ...(form.password ? { password: form.password } : {}),
        }
        await usersApi.update(editing.id, data)
        toast.success('Usuario actualizado')
      } else {
        const data: CreateUserData = {
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          rol: form.rol,
          estado: form.estado,
        }
        await usersApi.create(data)
        toast.success('Usuario creado')
      }
      setShowModal(false)
      fetchUsers()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Error al guardar usuario')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (user: User) => {
    setDeleting(user.id)
    try {
      await usersApi.remove(user.id)
      toast.success('Usuario eliminado')
      setShowDeleteModal(null)
      fetchUsers()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Error al eliminar usuario')
    } finally {
      setDeleting(null)
    }
  }

  const handleToggleStatus = async (user: User) => {
    const newStatus: EstadoUsuario = user.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO'
    try {
      await usersApi.updateStatus(user.id, newStatus)
      toast.success(`Usuario ${newStatus === 'ACTIVO' ? 'activado' : 'desactivado'}`)
      fetchUsers()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Error al cambiar estado')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} usuario{total !== 1 ? 's' : ''} en total</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Usuario
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="form-input pl-9 w-full"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <svg className="animate-spin h-6 w-6 text-primary-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-gray-500">No se encontraron usuarios</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Usuario</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Rol</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Estado</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Último acceso</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {user.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.nombre}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROL_COLORS[user.rol]}`}>
                      {ROL_LABELS[user.rol]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ESTADO_COLORS[user.estado]}`}>
                      {ESTADO_LABELS[user.estado]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
                      : 'Nunca'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* Edit */}
                      <button
                        onClick={() => openEdit(user)}
                        title="Editar"
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {/* Toggle status */}
                      {user.id !== currentUser?.id && user.rol !== 'ADMIN_TOTAL' && (
                        <button
                          onClick={() => handleToggleStatus(user)}
                          title={user.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                          className={`p-1.5 rounded hover:bg-gray-100 ${user.estado === 'ACTIVO' ? 'text-amber-500 hover:text-amber-700' : 'text-green-500 hover:text-green-700'}`}
                        >
                          {user.estado === 'ACTIVO' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                      )}
                      {/* Delete */}
                      {user.id !== currentUser?.id && user.rol !== 'ADMIN_TOTAL' && (
                        <button
                          onClick={() => setShowDeleteModal(user)}
                          title="Eliminar"
                          className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Página {page} de {totalPages}</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {editing ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-gray-100 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className="form-input w-full"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  placeholder="Ej: Juan García"
                />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input w-full"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="usuario@ejemplo.com"
                />
              </div>
              <div>
                <label className="form-label">
                  Contraseña {editing && <span className="text-gray-400 font-normal">(dejar vacío para no cambiar)</span>}
                </label>
                <input
                  type="password"
                  className="form-input w-full"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Rol</label>
                  <select
                    className="form-select w-full"
                    value={form.rol}
                    onChange={(e) => setForm((f) => ({ ...f, rol: e.target.value as RolUsuario }))}
                  >
                    <option value="USUARIO">Usuario</option>
                    <option value="SUPERVISOR">Supervisor</option>
                    <option value="ADMIN">Administrador</option>
                    <option value="ADMIN_TOTAL">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select w-full"
                    value={form.estado}
                    onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value as EstadoUsuario }))}
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                    <option value="BLOQUEADO">Bloqueado</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
              >
                {saving && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                {editing ? 'Guardar cambios' : 'Crear usuario'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-center text-lg font-semibold text-gray-900 mb-1">Eliminar usuario</h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              ¿Estás seguro de eliminar a <strong>{showDeleteModal.nombre}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deleting === showDeleteModal.id}
                className="flex-1 px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting === showDeleteModal.id && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
