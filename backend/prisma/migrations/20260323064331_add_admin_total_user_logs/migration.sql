-- CreateEnum
CREATE TYPE "AccionLog" AS ENUM ('LOGIN', 'LOGOUT', 'CREAR_USUARIO', 'EDITAR_USUARIO', 'ELIMINAR_USUARIO', 'CAMBIAR_PASSWORD');

-- AlterEnum
ALTER TYPE "RolUsuario" ADD VALUE 'ADMIN_TOTAL';

-- CreateTable
CREATE TABLE "user_logs" (
    "id" TEXT NOT NULL,
    "accion" "AccionLog" NOT NULL,
    "ip" TEXT,
    "user_agent" TEXT,
    "metadata" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_logs" ADD CONSTRAINT "user_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
