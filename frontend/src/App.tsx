import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './stores/authStore'
import Login from './pages/Login'
import Layout from './components/layout/Layout'
import ListaSedes from './pages/sedes/ListaSedes'
import FormSede from './pages/sedes/FormSede'
import ListaEmpleados from './pages/empleados/ListaEmpleados'
import AgregarEmpleado from './pages/empleados/AgregarEmpleado'
import CargaMasiva from './pages/empleados/CargaMasiva'
import ActualizacionMasiva from './pages/empleados/ActualizacionMasiva'
import PlanificacionCargos from './pages/planificacion/PlanificacionCargos'
import CargaMasivaPlanificacion from './pages/planificacion/CargaMasivaPlanificacion'
import DestinosPlan from './pages/planificacion/DestinosPlan'
import CargaMasivaDestinosPlan from './pages/planificacion/CargaMasivaDestinosPlan'
import Turnos from './pages/planificacion/Turnos'
import Novedades from './pages/planificacion/Novedades'
import Actividades from './pages/actividades/Actividades'
import Contratistas from './pages/contratistas/Contratistas'
import AgregarContratista from './pages/contratistas/AgregarContratista'
import Documentos from './pages/documentos/Documentos'
import AgregarDocumento from './pages/documentos/AgregarDocumento'
import CentrosCostos from './pages/centrosCostos/CentrosCostos'
import AgregarCentroCosto from './pages/centrosCostos/AgregarCentroCosto'
import Visitantes from './pages/visitantes/Visitantes'
import AgregarVisitante from './pages/visitantes/AgregarVisitante'
import Destinos from './pages/destinos/Destinos'
import AgregarDestino from './pages/destinos/AgregarDestino'
import Reportes from './pages/reportes/Reportes'
// SGSST
import DetallesEmpresa from './pages/sgsst/DetallesEmpresa'
import DiagnosticoInicial from './pages/sgsst/DiagnosticoInicial'
import PeriodosTrabajo from './pages/sgsst/PeriodosTrabajo'
import MatrizLegal from './pages/sgsst/MatrizLegal'
import PlaneadorActividades from './pages/planeador/PlaneadorActividades'
import GestionRiesgos from './pages/sgsst/GestionRiesgos'
import GestionDocumental from './pages/sgsst/GestionDocumental'
import FichasIndicadores from './pages/sgsst/FichasIndicadores'
import MisTrabajadores from './pages/sgsst/MisTrabajadores'
import PerfilesCargo from './pages/sgsst/PerfilesCargo'
import ReporteAusentismos from './pages/sgsst/ReporteAusentismos'
import MedicinaLaboral from './pages/sgsst/MedicinaLaboral'
import ReporteAccidentes from './pages/sgsst/ReporteAccidentes'
import BateriaPsicosocial from './pages/sgsst/BateriaPsicosocial'
import GestionTAR from './pages/sgsst/GestionTAR'
import ContratistasSST from './pages/sgsst/ContratistasSST'
import ActosCondicionesInseguras from './pages/sgsst/ActosCondicionesInseguras'
import MatrizMejora from './pages/sgsst/MatrizMejora'
import AccionesCorrectivas from './pages/sgsst/AccionesCorrectivas'
import InspeccionesSeguridad from './pages/sgsst/InspeccionesSeguridad'
import PlanesEmergencia from './pages/sgsst/PlanesEmergencia'
import EvaluacionSimulacros from './pages/sgsst/EvaluacionSimulacros'
import SeguridadVial from './pages/sgsst/SeguridadVial'
import GestionQuimicos from './pages/sgsst/GestionQuimicos'
import ControlesAcceso from './pages/sgsst/ControlesAcceso'
import Inicio from './pages/inicio/Inicio'
// Admin
import GestionUsuarios from './pages/admin/GestionUsuarios'
import MetricasPlataforma from './pages/admin/MetricasPlataforma'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuthStore()

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-sm text-gray-500">Verificando sesión...</span>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isInitialized } = useAuthStore()
  if (!isInitialized) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.rol !== 'ADMIN_TOTAL') return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Inicio />} />

          {/* Sedes */}
          <Route path="sedes" element={<ListaSedes />} />
          <Route path="sedes/agregar" element={<FormSede />} />
          <Route path="sedes/editar/:id" element={<FormSede />} />

          {/* Empleados */}
          <Route path="empleados" element={<ListaEmpleados />} />
          <Route path="empleados/agregar" element={<AgregarEmpleado />} />
          <Route path="empleados/editar/:id" element={<AgregarEmpleado />} />
          <Route path="empleados/carga-masiva" element={<CargaMasiva />} />
          <Route path="empleados/actualizacion-masiva" element={<ActualizacionMasiva />} />

          {/* Planificación */}
          <Route path="planificacion/cargos" element={<PlanificacionCargos />} />
          <Route path="planificacion/carga-masiva" element={<CargaMasivaPlanificacion />} />
          <Route path="planificacion/destinos" element={<DestinosPlan />} />
          <Route path="planificacion/destinos/carga-masiva" element={<CargaMasivaDestinosPlan />} />
          <Route path="planificacion/turnos" element={<Turnos />} />
          <Route path="planificacion/novedades" element={<Novedades />} />

          {/* Módulos */}
          <Route path="actividades" element={<Actividades />} />
          <Route path="contratistas" element={<Contratistas />} />
          <Route path="contratistas/agregar" element={<AgregarContratista />} />
          <Route path="documentos" element={<Documentos />} />
          <Route path="documentos/agregar" element={<AgregarDocumento />} />
          <Route path="centros-costos" element={<CentrosCostos />} />
          <Route path="centros-costos/agregar" element={<AgregarCentroCosto />} />
          <Route path="visitantes" element={<Visitantes />} />
          <Route path="visitantes/agregar" element={<AgregarVisitante />} />
          <Route path="destinos" element={<Destinos />} />
          <Route path="destinos/agregar" element={<AgregarDestino />} />
          <Route path="reportes" element={<Reportes />} />

          {/* Admin (solo ADMIN_TOTAL) */}
          <Route path="admin/usuarios" element={<AdminRoute><GestionUsuarios /></AdminRoute>} />
          <Route path="admin/metricas" element={<AdminRoute><MetricasPlataforma /></AdminRoute>} />

          {/* SGSST */}
          <Route path="sgsst/empresa" element={<DetallesEmpresa />} />
          <Route path="sgsst/diagnostico" element={<DiagnosticoInicial />} />
          <Route path="sgsst/periodos" element={<PeriodosTrabajo />} />
          <Route path="sgsst/matriz-legal" element={<MatrizLegal />} />
          <Route path="sgsst/planeador-actividades" element={<PlaneadorActividades />} />
          <Route path="sgsst/riesgos" element={<GestionRiesgos />} />
          <Route path="sgsst/documentos" element={<GestionDocumental />} />
          <Route path="sgsst/indicadores" element={<FichasIndicadores />} />
          <Route path="sgsst/trabajadores" element={<MisTrabajadores />} />
          <Route path="sgsst/perfiles-cargo" element={<PerfilesCargo />} />
          <Route path="sgsst/ausentismos" element={<ReporteAusentismos />} />
          <Route path="sgsst/medicina-laboral" element={<MedicinaLaboral />} />
          <Route path="sgsst/accidentes" element={<ReporteAccidentes />} />
          <Route path="sgsst/bateria-psicosocial" element={<BateriaPsicosocial />} />
          <Route path="sgsst/tar" element={<GestionTAR />} />
          <Route path="sgsst/contratistas" element={<ContratistasSST />} />
          <Route path="sgsst/actos-condiciones" element={<ActosCondicionesInseguras />} />
          <Route path="sgsst/matriz-mejora" element={<MatrizMejora />} />
          <Route path="sgsst/acciones-correctivas" element={<AccionesCorrectivas />} />
          <Route path="sgsst/inspecciones" element={<InspeccionesSeguridad />} />
          <Route path="sgsst/emergencias" element={<PlanesEmergencia />} />
          <Route path="sgsst/simulacros" element={<EvaluacionSimulacros />} />
          <Route path="sgsst/seguridad-vial" element={<SeguridadVial />} />
          <Route path="sgsst/quimicos" element={<GestionQuimicos />} />
          <Route path="sgsst/controles-acceso" element={<ControlesAcceso />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
