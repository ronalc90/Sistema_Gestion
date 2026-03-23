import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Centro de costo
  const cc1 = await prisma.centroCosto.upsert({
    where: { codigo: 'CC-001' },
    update: {},
    create: { codigo: 'CC-001', nombre: 'Operaciones', descripcion: 'Centro de costo operativo', activo: true },
  });

  const cc2 = await prisma.centroCosto.upsert({
    where: { codigo: 'CC-002' },
    update: {},
    create: { codigo: 'CC-002', nombre: 'Administración', descripcion: 'Centro de costo administrativo', activo: true },
  });

  // Sedes
  const sede1 = await prisma.sede.upsert({
    where: { id: 'sede-seed-1' },
    update: {},
    create: {
      id: 'sede-seed-1',
      nombre: 'Sede Principal',
      estado: 'ACTIVO',
      tiempoDescanso: '1 hora',
      fechaInicial: new Date('2024-01-01'),
      fechaFinal: new Date('2024-12-31'),
      nombreColeccion: 'SEDE_PRINCIPAL',
      centroCostoId: cc1.id,
      horarios: {
        create: [
          { dia: 'LUNES',     activo: true,  horaInicio: '08:00', horaFin: '17:00' },
          { dia: 'MARTES',    activo: true,  horaInicio: '08:00', horaFin: '17:00' },
          { dia: 'MIERCOLES', activo: true,  horaInicio: '08:00', horaFin: '17:00' },
          { dia: 'JUEVES',    activo: true,  horaInicio: '08:00', horaFin: '17:00' },
          { dia: 'VIERNES',   activo: true,  horaInicio: '08:00', horaFin: '16:00' },
          { dia: 'SABADO',    activo: false, horaInicio: null,    horaFin: null    },
          { dia: 'DOMINGO',   activo: false, horaInicio: null,    horaFin: null    },
        ],
      },
    },
  });

  await prisma.sede.upsert({
    where: { id: 'sede-seed-2' },
    update: {},
    create: {
      id: 'sede-seed-2',
      nombre: 'Sede Norte',
      estado: 'ACTIVO',
      tiempoDescanso: '30 minutos',
      fechaInicial: new Date('2024-03-01'),
      fechaFinal: new Date('2024-12-31'),
      nombreColeccion: 'SEDE_NORTE',
      centroCostoId: cc2.id,
      horarios: {
        create: [
          { dia: 'LUNES',     activo: true,  horaInicio: '07:00', horaFin: '16:00' },
          { dia: 'MARTES',    activo: true,  horaInicio: '07:00', horaFin: '16:00' },
          { dia: 'MIERCOLES', activo: true,  horaInicio: '07:00', horaFin: '16:00' },
          { dia: 'JUEVES',    activo: true,  horaInicio: '07:00', horaFin: '16:00' },
          { dia: 'VIERNES',   activo: true,  horaInicio: '07:00', horaFin: '15:00' },
          { dia: 'SABADO',    activo: true,  horaInicio: '08:00', horaFin: '12:00' },
          { dia: 'DOMINGO',   activo: false, horaInicio: null,    horaFin: null    },
        ],
      },
    },
  });

  // Contratistas
  await prisma.contratista.upsert({
    where: { nit: '900123456-1' },
    update: {},
    create: {
      nombre: 'Construcciones ABC S.A.S',
      nit: '900123456-1',
      representante: 'Carlos Gómez',
      telefono: '3001234567',
      email: 'contacto@abc.com',
      direccion: 'Calle 10 # 20-30',
      estado: 'ACTIVO',
    },
  });

  await prisma.contratista.upsert({
    where: { nit: '800987654-2' },
    update: {},
    create: {
      nombre: 'Servicios Industriales XYZ',
      nit: '800987654-2',
      representante: 'María López',
      telefono: '3107654321',
      email: 'info@xyz.com',
      direccion: 'Carrera 5 # 15-20',
      estado: 'ACTIVO',
    },
  });

  // Super administrador
  const hashedAdminTotal = await bcrypt.hash('admin', 10);
  await prisma.user.upsert({
    where: { email: 'admintotal@gmail.com' },
    update: {},
    create: {
      nombre: 'Super Administrador',
      email: 'admintotal@gmail.com',
      password: hashedAdminTotal,
      rol: 'ADMIN_TOTAL',
      estado: 'ACTIVO',
    },
  });

  // Admin regular
  const hashedAdmin = await bcrypt.hash('admin', 10);
  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      nombre: 'Administrador',
      email: 'admin@gmail.com',
      password: hashedAdmin,
      rol: 'ADMIN',
      estado: 'ACTIVO',
    },
  });

  // Admin empresa (legacy)
  const hashedEmpresa = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@empresa.com' },
    update: {},
    create: {
      nombre: 'Admin Empresa',
      email: 'admin@empresa.com',
      password: hashedEmpresa,
      rol: 'ADMIN',
      estado: 'ACTIVO',
    },
  });

  console.log('✅ Seed completado exitosamente');
  console.log(`   - 2 Centros de costo`);
  console.log(`   - 2 Sedes con horarios`);
  console.log(`   - 2 Contratistas`);
  console.log(`   - admintotal@gmail.com / admin (ADMIN_TOTAL)`);
  console.log(`   - admin@gmail.com / admin (ADMIN)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
