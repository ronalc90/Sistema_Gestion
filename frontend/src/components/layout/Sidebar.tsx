import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useModuleStore } from '../../stores/moduleStore'
import { useTranslation } from '../../hooks/useTranslation'
import {
  FaBuilding, FaClipboard, FaCalendarAlt, FaListOl, FaCalendar,
  FaChartArea, FaFolderOpen, FaTasks, FaUsers, FaSlideshare,
  FaUserTimes, FaUserMd, FaHeartbeat, FaListAlt, FaCrosshairs,
  FaHandshake, FaExclamationTriangle, FaThumbtack, FaPen,
  FaSearch, FaBullhorn, FaBullseye, FaCar, FaFlask, FaUnlockAlt,
} from 'react-icons/fa'

/* ── COMPONENT ──────────────────────────────────────────── */
export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const { activeModule, setModule } = useModuleStore()
  const { t } = useTranslation()

  /* ── GESTION NAV ─────────────────────────────────────────── */
  interface SubItem { label: string; path: string }
  interface NavItem { id: string; label: string; icon: React.ReactNode; children: SubItem[] }

  const gestionItems: NavItem[] = [
    {
      id: 'planificacion', label: t('navigation.planning'),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
      children: [
        { label: t('modules.planning.positions'), path: '/planificacion/cargos' },
        { label: t('modules.planning.bulkUpload'), path: '/planificacion/carga-masiva' },
      ],
    },
    {
      id: 'empleados', label: t('navigation.employees'),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      children: [
        { label: t('modules.employees.list'), path: '/empleados' },
        { label: t('modules.employees.add'), path: '/empleados/agregar' },
        { label: t('modules.employees.bulkUpload'), path: '/empleados/carga-masiva' },
        { label: t('modules.employees.bulkUpdate'), path: '/empleados/actualizacion-masiva' },
      ],
    },
    {
      id: 'actividades', label: t('navigation.activities'),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
      children: [{ label: t('navigation.activities'), path: '/actividades' }],
    },
    {
      id: 'contratistas', label: t('navigation.contractors'),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      children: [{ label: t('navigation.contractors'), path: '/contratistas' }],
    },
    {
      id: 'documentos', label: t('navigation.documents'),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
      children: [{ label: t('navigation.documents'), path: '/documentos' }],
    },
    {
      id: 'centros-costos', label: t('navigation.costCenters'),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      children: [{ label: t('navigation.costCenters'), path: '/centros-costos' }],
    },
    {
      id: 'visitantes', label: t('navigation.visitors'),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
      children: [{ label: t('navigation.visitors'), path: '/visitantes' }],
    },
    {
      id: 'destinos', label: t('navigation.destinations'),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      children: [{ label: t('navigation.destinations'), path: '/destinos' }],
    },
    {
      id: 'reportes', label: t('navigation.reports'),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      children: [{ label: t('navigation.reports'), path: '/reportes' }],
    },
    {
      id: 'sedes', label: t('navigation.headquarters'),
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
      children: [
        { label: t('modules.headquarters.list'), path: '/sedes' },
        { label: t('modules.headquarters.add'), path: '/sedes/agregar' },
      ],
    },
  ]

  /* ── SGSST NAV ───────────────────────────────────────────── */
  interface SgsstItem { id: string; label: string; icon: React.ReactNode; path: string }
  interface SgsstGroup { id: string; label: string; items: SgsstItem[] }

  const sgsstGroups: SgsstGroup[] = [
    {
      id: 'empresa', label: t('navigation.sgsstGroups.company'),
      items: [
        { id: 'empresa', label: t('sgsst.company.title'), path: '/sgsst/empresa', icon: <FaBuilding /> },
        { id: 'diagnostico', label: t('sgsst.diagnosis.title'), path: '/sgsst/diagnostico', icon: <FaClipboard /> },
      ],
    },
    {
      id: 'admin', label: t('navigation.sgsstGroups.admin'),
      items: [
        { id: 'periodos', label: t('sgsst.periods.title'), path: '/sgsst/periodos', icon: <FaCalendarAlt /> },
        { id: 'matriz-legal', label: t('sgsst.legalMatrix.title'), path: '/sgsst/matriz-legal', icon: <FaListOl /> },
        { id: 'planeador', label: t('sgsst.activityPlanner.title'), path: '/sgsst/planeador', icon: <FaCalendar /> },
      ],
    },
    {
      id: 'gestion-sst', label: t('navigation.sgsstGroups.gestion'),
      items: [
        { id: 'riesgos', label: t('sgsst.riskManagement.title'), path: '/sgsst/riesgos', icon: <FaChartArea /> },
        { id: 'documentos', label: t('sgsst.documentManagement.title'), path: '/sgsst/documentos', icon: <FaFolderOpen /> },
        { id: 'indicadores', label: t('sgsst.indicators.title'), path: '/sgsst/indicadores', icon: <FaTasks /> },
      ],
    },
    {
      id: 'personal', label: t('navigation.sgsstGroups.personal'),
      items: [
        { id: 'trabajadores', label: t('sgsst.workers.title'), path: '/sgsst/trabajadores', icon: <FaUsers /> },
        { id: 'perfiles-cargo', label: t('sgsst.jobProfiles.title'), path: '/sgsst/perfiles-cargo', icon: <FaSlideshare /> },
        { id: 'ausentismos', label: t('sgsst.absenteeism.title'), path: '/sgsst/ausentismos', icon: <FaUserTimes /> },
      ],
    },
    {
      id: 'salud', label: t('navigation.sgsstGroups.health'),
      items: [
        { id: 'medicina', label: t('sgsst.occupationalHealth.title'), path: '/sgsst/medicina-laboral', icon: <FaUserMd /> },
        { id: 'accidentes', label: t('sgsst.accidents.title'), path: '/sgsst/accidentes', icon: <FaHeartbeat /> },
      ],
    },
    {
      id: 'evaluaciones', label: t('navigation.sgsstGroups.evaluations'),
      items: [
        { id: 'bateria', label: t('sgsst.psychosocial.title'), path: '/sgsst/bateria-psicosocial', icon: <FaListAlt /> },
        { id: 'tar', label: t('sgsst.tar.title'), path: '/sgsst/tar', icon: <FaCrosshairs /> },
      ],
    },
    {
      id: 'contratistas-riesgos', label: t('navigation.sgsstGroups.contractors'),
      items: [
        { id: 'contratistas', label: t('sgsst.contractors.title'), path: '/sgsst/contratistas', icon: <FaHandshake /> },
        { id: 'actos', label: t('sgsst.unsafeConditions.title'), path: '/sgsst/actos-condiciones', icon: <FaExclamationTriangle /> },
      ],
    },
    {
      id: 'mejora', label: t('navigation.sgsstGroups.improvement'),
      items: [
        { id: 'matriz-mejora', label: t('sgsst.improvement.title'), path: '/sgsst/matriz-mejora', icon: <FaThumbtack /> },
        { id: 'acciones', label: t('sgsst.correctiveActions.title'), path: '/sgsst/acciones-correctivas', icon: <FaPen /> },
        { id: 'inspecciones', label: t('sgsst.inspections.title'), path: '/sgsst/inspecciones', icon: <FaSearch /> },
      ],
    },
    {
      id: 'emergencias', label: t('navigation.sgsstGroups.emergencies'),
      items: [
        { id: 'planes', label: t('sgsst.emergency.title'), path: '/sgsst/emergencias', icon: <FaBullhorn /> },
        { id: 'simulacros', label: t('sgsst.drills.title'), path: '/sgsst/simulacros', icon: <FaBullseye /> },
      ],
    },
    {
      id: 'especiales', label: t('navigation.sgsstGroups.special'),
      items: [
        { id: 'vial', label: t('sgsst.roadSafety.title'), path: '/sgsst/seguridad-vial', icon: <FaCar /> },
        { id: 'quimicos', label: t('sgsst.chemicals.title'), path: '/sgsst/quimicos', icon: <FaFlask /> },
        { id: 'acceso', label: t('sgsst.accessControl.title'), path: '/sgsst/controles-acceso', icon: <FaUnlockAlt /> },
      ],
    },
  ]

  const getInitialOpen = () => {
    const open: Record<string, boolean> = {}
    gestionItems.forEach((item) => {
      if (item.children.some((c) => location.pathname === c.path || location.pathname.startsWith(c.path + '/'))) {
        open[item.id] = true
      }
    })
    return open
  }
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(getInitialOpen)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(sgsstGroups.map((g) => [g.id, false]))
  )

  const toggleMenu = (id: string) => setOpenMenus((p) => ({ ...p, [id]: !p[id] }))
  const toggleGroup = (id: string) => setOpenGroups((p) => ({ ...p, [id]: !p[id] }))

  const switchModule = (mod: 'gestion' | 'sgsst') => {
    setModule(mod)
    navigate(mod === 'gestion' ? '/sedes' : '/sgsst/empresa')
  }

  return (
    <aside className="flex flex-col h-full w-60 bg-primary-700 text-white shrink-0">

      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-primary-600">
        <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <span className="text-sm font-semibold leading-tight">{t('common.appName')}</span>
      </div>

      {/* Module switcher */}
      <div className="px-3 py-2.5 border-b border-primary-600">
        <div className="flex rounded-lg bg-primary-800/50 p-0.5 gap-0.5">
          <button
            onClick={() => switchModule('gestion')}
            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              activeModule === 'gestion'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {t('navigation.management')}
          </button>
          <button
            onClick={() => switchModule('sgsst')}
            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              activeModule === 'sgsst'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {t('navigation.sgsst')}
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">

        {/* GESTIÓN */}
        {activeModule === 'gestion' && (
          <div className="space-y-0.5">
            {gestionItems.map((item) => {
              const isOpen = openMenus[item.id]
              const hasActive = item.children.some(
                (c) => location.pathname === c.path || location.pathname.startsWith(c.path + '/')
              )
              return (
                <div key={item.id}>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      hasActive ? 'bg-primary-800 text-white' : 'text-white/80 hover:bg-primary-600 hover:text-white'
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="flex-1 text-left truncate text-xs">{item.label}</span>
                    <svg
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="mt-0.5 ml-4 space-y-0.5">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          end={child.path === '/empleados' || child.path === '/sedes'}
                          className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg text-xs transition-colors ${
                              isActive
                                ? 'bg-primary-900 text-white font-medium'
                                : 'text-white/70 hover:bg-primary-600 hover:text-white'
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* SGSST */}
        {activeModule === 'sgsst' && (
          <div className="space-y-0.5">
            {sgsstGroups.map((group) => {
              const isOpen = openGroups[group.id]
              const hasActive = group.items.some(
                (i) => location.pathname === i.path || location.pathname.startsWith(i.path + '/')
              )
              return (
                <div key={group.id}>
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors ${
                      hasActive ? 'bg-primary-800 text-white' : 'text-white/60 hover:bg-primary-600 hover:text-white'
                    }`}
                  >
                    <span className="flex-1 text-left truncate">{group.label}</span>
                    <svg
                      className={`w-3 h-3 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="mt-0.5 ml-2 space-y-0.5">
                      {group.items.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                              isActive
                                ? 'bg-primary-900 text-white font-medium'
                                : 'text-white/70 hover:bg-primary-600 hover:text-white'
                            }`
                          }
                        >
                          <span className="shrink-0 text-sm">{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </nav>

      {/* Admin section (ADMIN_TOTAL only) */}
      {user?.rol === 'ADMIN_TOTAL' && (
        <div className="border-t border-primary-600 px-2 py-2">
          <p className="px-3 py-1 text-xs text-white/40 uppercase tracking-wider font-semibold">Admin</p>
          <NavLink
            to="/admin/usuarios"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                isActive ? 'bg-primary-900 text-white font-medium' : 'text-white/70 hover:bg-primary-600 hover:text-white'
              }`
            }
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Gestión de Usuarios
          </NavLink>
          <NavLink
            to="/admin/metricas"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                isActive ? 'bg-primary-900 text-white font-medium' : 'text-white/70 hover:bg-primary-600 hover:text-white'
              }`
            }
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Métricas de Plataforma
          </NavLink>
        </div>
      )}

      {/* User / Logout */}
      <div className="border-t border-primary-600 px-3 py-3">
        <div className="flex items-center gap-2 mb-2 px-1">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
            {user?.nombre.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{user?.nombre}</p>
            <p className="text-xs text-white/60 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/70 hover:bg-primary-600 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {t('auth.logout')}
        </button>
      </div>
    </aside>
  )
}
