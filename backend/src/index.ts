/**
 * Punto de entrada principal del servidor
 * Configura Express, middlewares y rutas
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import prisma from './config/database';

// Importar rutas
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import sedeRoutes from './routes/sede.routes';
import contratistaRoutes from './routes/contratista.routes';
import centroCostoRoutes from './routes/centro-costo.routes';
import empleadoRoutes from './routes/empleado.routes';
import actividadRoutes from './routes/actividad.routes';
import destinoRoutes from './routes/destino.routes';
import planificacionRoutes from './routes/planificacion.routes';
import planificacionCargoRoutes from './routes/planificacionCargo.routes';
import turnoRoutes from './routes/turno.routes';
import visitanteRoutes from './routes/visitante.routes';
import documentoRoutes from './routes/documento.routes';
import dashboardRoutes from './routes/dashboard.routes';
import notificationsRoutes from './routes/notifications.routes';
import sstContratistaRoutes from './routes/sstContratista.routes';

// Importar middlewares
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middlewares globales
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:5173', 'http://localhost:3000'] 
    : '*',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Archivos estáticos para uploads
app.use('/uploads', express.static(path.join(process.cwd(), env.UPLOAD_DIR)));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sedes', sedeRoutes);
app.use('/api/contratistas', contratistaRoutes);
app.use('/api/centros-costo', centroCostoRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/actividades', actividadRoutes);
app.use('/api/destinos', destinoRoutes);
app.use('/api/planificaciones', planificacionRoutes);
app.use('/api/planificaciones-cargos', planificacionCargoRoutes);
app.use('/api/turnos', turnoRoutes);
app.use('/api/visitantes', visitanteRoutes);
app.use('/api/documentos', documentoRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/sst/contratistas', sstContratistaRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Error handler global
app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    app.listen(env.PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${env.PORT}`);
      console.log(`📚 API Documentation: http://localhost:${env.PORT}/health`);
      console.log(`🔧 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Manejo de señales para cierre graceful
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recibido, cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
