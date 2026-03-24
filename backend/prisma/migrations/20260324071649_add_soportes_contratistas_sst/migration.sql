-- CreateTable
CREATE TABLE "soportes_contratistas_sst" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo_documento" TEXT,
    "descripcion" TEXT,
    "storage_key" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "tamanio" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contratista_id" TEXT NOT NULL,

    CONSTRAINT "soportes_contratistas_sst_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "soportes_contratistas_sst" ADD CONSTRAINT "soportes_contratistas_sst_contratista_id_fkey" FOREIGN KEY ("contratista_id") REFERENCES "contratistas_sst"("id") ON DELETE CASCADE ON UPDATE CASCADE;
