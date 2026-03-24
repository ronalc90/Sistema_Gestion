-- AlterTable: hacer contratista_id opcional y agregar trabajador_id
ALTER TABLE "soportes_contratistas_sst" ALTER COLUMN "contratista_id" DROP NOT NULL;
ALTER TABLE "soportes_contratistas_sst" ADD COLUMN "trabajador_id" TEXT;

-- AddForeignKey
ALTER TABLE "soportes_contratistas_sst" ADD CONSTRAINT "soportes_contratistas_sst_trabajador_id_fkey" FOREIGN KEY ("trabajador_id") REFERENCES "trabajadores_sst"("id") ON DELETE CASCADE ON UPDATE CASCADE;
