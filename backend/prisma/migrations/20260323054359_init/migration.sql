-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'USUARIO', 'SUPERVISOR');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('ACTIVO', 'INACTIVO', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "EstadoSede" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "EstadoContratista" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "TipoIdentificacion" AS ENUM ('CC', 'CE', 'PASAPORTE', 'NIT');

-- CreateEnum
CREATE TYPE "EstadoEmpleado" AS ENUM ('ACTIVO', 'INACTIVO', 'VACACIONES', 'INCAPACITADO');

-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO', 'PREFIERO_NO_DECIR');

-- CreateEnum
CREATE TYPE "EstadoDestino" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "EstadoPlanificacion" AS ENUM ('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoTurno" AS ENUM ('DIURNO', 'NOCTURNO', 'MIXTO', 'FIN_DE_SEMANA', 'FESTIVO');

-- CreateEnum
CREATE TYPE "EstadoTurno" AS ENUM ('PROGRAMADO', 'EN_CURSO', 'COMPLETADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoVisitante" AS ENUM ('PERSONAL', 'EMPRESARIAL', 'PROVEEDOR', 'CLIENTE', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoVisitante" AS ENUM ('EN_SITIO', 'FINALIZADA');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('CONTRATO', 'CEDULA', 'HV', 'CERTIFICADO', 'LICENCIA', 'EXAMEN_MEDICO', 'POLIZA', 'OTRO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'USUARIO',
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'ACTIVO',
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sedes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "EstadoSede" NOT NULL DEFAULT 'ACTIVO',
    "tiempo_descanso" TEXT,
    "fecha_inicial" TIMESTAMP(3),
    "fecha_final" TIMESTAMP(3),
    "nombre_coleccion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "centro_costo_id" TEXT,

    CONSTRAINT "sedes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horarios_sede" (
    "id" TEXT NOT NULL,
    "dia" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "hora_inicio" TEXT,
    "hora_fin" TEXT,
    "sede_id" TEXT NOT NULL,

    CONSTRAINT "horarios_sede_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratistas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nit" TEXT,
    "representante" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "estado" "EstadoContratista" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contratistas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "centros_costos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "presupuesto" DECIMAL(15,2),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "centros_costos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empleados" (
    "id" TEXT NOT NULL,
    "tipo_id" "TipoIdentificacion" NOT NULL DEFAULT 'CC',
    "numero_id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "fecha_nacimiento" TIMESTAMP(3),
    "genero" "Genero",
    "direccion" TEXT,
    "cargo" TEXT,
    "fecha_ingreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_retiro" TIMESTAMP(3),
    "salario" DECIMAL(12,2),
    "estado" "EstadoEmpleado" NOT NULL DEFAULT 'ACTIVO',
    "eps" TEXT,
    "fondo_pensiones" TEXT,
    "arl" TEXT,
    "contacto_emergencia" TEXT,
    "telefono_emergencia" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sede_id" TEXT NOT NULL,
    "contratista_id" TEXT,
    "centro_costo_id" TEXT,

    CONSTRAINT "empleados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividades" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" "EstadoDestino" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sede_id" TEXT NOT NULL,

    CONSTRAINT "destinos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planificaciones" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "descripcion" TEXT,
    "estado" "EstadoPlanificacion" NOT NULL DEFAULT 'PENDIENTE',
    "hora_inicio" TIMESTAMP(3),
    "hora_fin" TIMESTAMP(3),
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "creador_id" TEXT NOT NULL,
    "empleado_id" TEXT NOT NULL,
    "contratista_id" TEXT,
    "actividad_id" TEXT,
    "destino_id" TEXT,

    CONSTRAINT "planificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turnos" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tipo" "TipoTurno" NOT NULL DEFAULT 'DIURNO',
    "hora_inicio" TIMESTAMP(3) NOT NULL,
    "hora_fin" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoTurno" NOT NULL DEFAULT 'PROGRAMADO',
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "empleado_id" TEXT NOT NULL,

    CONSTRAINT "turnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitantes" (
    "id" TEXT NOT NULL,
    "tipo" "TipoVisitante" NOT NULL DEFAULT 'PERSONAL',
    "nombre" TEXT NOT NULL,
    "identificacion" TEXT,
    "empresa" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "motivo" TEXT NOT NULL,
    "fecha_entrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_salida" TIMESTAMP(3),
    "estado" "EstadoVisitante" NOT NULL DEFAULT 'EN_SITIO',
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sede_id" TEXT NOT NULL,
    "registrado_por_id" TEXT NOT NULL,

    CONSTRAINT "visitantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoDocumento" NOT NULL,
    "descripcion" TEXT,
    "url" TEXT NOT NULL,
    "tamanio" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "carpeta" TEXT NOT NULL DEFAULT 'general',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "empleado_id" TEXT,
    "subido_por_id" TEXT NOT NULL,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "horarios_sede_sede_id_dia_key" ON "horarios_sede"("sede_id", "dia");

-- CreateIndex
CREATE UNIQUE INDEX "contratistas_nit_key" ON "contratistas"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "centros_costos_codigo_key" ON "centros_costos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "empleados_tipo_id_numero_id_key" ON "empleados"("tipo_id", "numero_id");

-- CreateIndex
CREATE UNIQUE INDEX "actividades_codigo_key" ON "actividades"("codigo");

-- AddForeignKey
ALTER TABLE "sedes" ADD CONSTRAINT "sedes_centro_costo_id_fkey" FOREIGN KEY ("centro_costo_id") REFERENCES "centros_costos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios_sede" ADD CONSTRAINT "horarios_sede_sede_id_fkey" FOREIGN KEY ("sede_id") REFERENCES "sedes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empleados" ADD CONSTRAINT "empleados_sede_id_fkey" FOREIGN KEY ("sede_id") REFERENCES "sedes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empleados" ADD CONSTRAINT "empleados_contratista_id_fkey" FOREIGN KEY ("contratista_id") REFERENCES "contratistas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empleados" ADD CONSTRAINT "empleados_centro_costo_id_fkey" FOREIGN KEY ("centro_costo_id") REFERENCES "centros_costos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destinos" ADD CONSTRAINT "destinos_sede_id_fkey" FOREIGN KEY ("sede_id") REFERENCES "sedes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planificaciones" ADD CONSTRAINT "planificaciones_creador_id_fkey" FOREIGN KEY ("creador_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planificaciones" ADD CONSTRAINT "planificaciones_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "empleados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planificaciones" ADD CONSTRAINT "planificaciones_contratista_id_fkey" FOREIGN KEY ("contratista_id") REFERENCES "contratistas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planificaciones" ADD CONSTRAINT "planificaciones_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "actividades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planificaciones" ADD CONSTRAINT "planificaciones_destino_id_fkey" FOREIGN KEY ("destino_id") REFERENCES "destinos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "empleados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitantes" ADD CONSTRAINT "visitantes_sede_id_fkey" FOREIGN KEY ("sede_id") REFERENCES "sedes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitantes" ADD CONSTRAINT "visitantes_registrado_por_id_fkey" FOREIGN KEY ("registrado_por_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "empleados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_subido_por_id_fkey" FOREIGN KEY ("subido_por_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
