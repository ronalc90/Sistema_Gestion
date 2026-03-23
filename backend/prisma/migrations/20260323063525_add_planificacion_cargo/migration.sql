-- CreateTable
CREATE TABLE "planificaciones_cargos" (
    "id" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "contratista_id" TEXT NOT NULL,
    "sede_id" TEXT NOT NULL,

    CONSTRAINT "planificaciones_cargos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "planificaciones_cargos" ADD CONSTRAINT "planificaciones_cargos_contratista_id_fkey" FOREIGN KEY ("contratista_id") REFERENCES "contratistas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planificaciones_cargos" ADD CONSTRAINT "planificaciones_cargos_sede_id_fkey" FOREIGN KEY ("sede_id") REFERENCES "sedes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
