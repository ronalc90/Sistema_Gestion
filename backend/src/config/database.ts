/**
 * Configuración de la base de datos con Prisma
 * Implementa el patrón Singleton para reutilizar la instancia
 */
import { PrismaClient } from '@prisma/client';

// Configuración de logging basado en el entorno
const isDevelopment = process.env.NODE_ENV === 'development';

const prisma = new PrismaClient({
  log: isDevelopment
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

// Manejo de cierre graceful
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
