import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

// ── Contratistas SST ──────────────────────────────────────────────────────────

export const getContratistasSST = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search as string | undefined;
    const estado = req.query.estado as string | undefined;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { razonSocial: { contains: search, mode: 'insensitive' } },
        { nit: { contains: search, mode: 'insensitive' } },
        { representante: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (estado) where.estado = estado;

    const [data, total] = await Promise.all([
      prisma.contratistaSST.findMany({
        where,
        skip,
        take: limit,
        orderBy: { razonSocial: 'asc' },
        include: { _count: { select: { trabajadores: true } } },
      }),
      prisma.contratistaSST.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Contratistas SST obtenidos',
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllContratistasSST = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await prisma.contratistaSST.findMany({
      orderBy: { razonSocial: 'asc' },
      include: { _count: { select: { trabajadores: true } } },
    });
    res.json({ success: true, message: 'Contratistas SST obtenidos', data });
  } catch (error) {
    next(error);
  }
};

export const getContratistaSSTById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await prisma.contratistaSST.findUnique({
      where: { id },
      include: {
        trabajadores: { orderBy: { nombre: 'asc' } },
        _count: { select: { trabajadores: true } },
      },
    });
    if (!data) { res.status(404).json({ success: false, message: 'Contratista SST no encontrado' }); return; }
    res.json({ success: true, message: 'Contratista SST obtenido', data });
  } catch (error) {
    next(error);
  }
};

// Extrae sólo los campos que existen en el modelo ContratistaSST
function pickContratistaFields(body: Record<string, unknown>) {
  const allowed = [
    'razonSocial','representante','nombreComercial','nit','nitDigito','direccion','telefono','email','sitioWeb',
    'tipo','tamano','departamento','municipio','actividadEconomica',
    'arl','nivelRiesgo','vencimientoSS','operadorPagoSS','centroEntrenamiento','consultaExamenMedico','ipsExamenes',
    'clasificacionCategoria','clasificacionCuadrante','personaContacto','contactoAdmin','actividades','costoHora',
    'activo','actualizacionMasivaSS','actualizacionMasivaCursos','usuario','clave','permisosEspeciales',
    'categoria1','categoria2','categoria3','codigoSistemaExterno','estado','diasCorte',
  ];
  return Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
}

export const createContratistaSST = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await prisma.contratistaSST.create({ data: pickContratistaFields(req.body) as Parameters<typeof prisma.contratistaSST.create>[0]['data'] });
    res.status(201).json({ success: true, message: 'Contratista SST creado', data });
  } catch (error) {
    next(error);
  }
};

export const updateContratistaSST = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await prisma.contratistaSST.update({ where: { id }, data: pickContratistaFields(req.body) as Parameters<typeof prisma.contratistaSST.update>[0]['data'] });
    res.json({ success: true, message: 'Contratista SST actualizado', data });
  } catch (error) {
    next(error);
  }
};

export const deleteContratistaSST = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.contratistaSST.delete({ where: { id } });
    res.json({ success: true, message: 'Contratista SST eliminado' });
  } catch (error) {
    next(error);
  }
};

// ── Trabajadores SST ──────────────────────────────────────────────────────────

export const getTrabajadoresSST = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = (page - 1) * limit;
    const search = req.query.search as string | undefined;
    const contratistaId = req.query.contratistaId as string | undefined;

    const where: Record<string, unknown> = {};
    if (contratistaId) where.contratistaId = contratistaId;
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { documento: { contains: search, mode: 'insensitive' } },
        { cargo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.trabajadorSST.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nombre: 'asc' },
        include: { contratista: { select: { id: true, razonSocial: true } } },
      }),
      prisma.trabajadorSST.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Trabajadores SST obtenidos',
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

export const getTrabajadorSSTById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await prisma.trabajadorSST.findUnique({
      where: { id },
      include: { contratista: { select: { id: true, razonSocial: true } } },
    });
    if (!data) { res.status(404).json({ success: false, message: 'Trabajador SST no encontrado' }); return; }
    res.json({ success: true, message: 'Trabajador SST obtenido', data });
  } catch (error) {
    next(error);
  }
};

function pickTrabajadorFields(body: Record<string, unknown>) {
  const allowed = [
    'documento','nombre','cargo','sede','contratistaId',
    'historia','activo','habilitado','parafiscales','certificacion','otrosCursos','induccion','empleadoActivo',
    'fechaExpedicion','fechaNacimiento','sexo','estadoCivil','ubicacionFisica','tipoVinculacion','salario','nivelEscolaridad','raza',
    'correo','eps','direccionResidencia','telefonoResidencia','telefonoMovil','grupoSanguineo','discapacidad',
    'contactoEmergencias','telefonoEmergencias','enfermedades','transporte','ingresoEmpresa','retiroEmpresa',
    'vencExamen','vencAlturas','vencConfinados','certRequeridas',
    'accesoContratista','estadoSS','certTareas','cursoEspecifico','induccionSitio','fechaRevision','periodicidadExamen','accesoGeneral',
    'fotografia','notas',
  ];
  return Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
}

export const createTrabajadorSST = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await prisma.trabajadorSST.create({
      data: pickTrabajadorFields(req.body) as Parameters<typeof prisma.trabajadorSST.create>[0]['data'],
      include: { contratista: { select: { id: true, razonSocial: true } } },
    });
    res.status(201).json({ success: true, message: 'Trabajador SST creado', data });
  } catch (error) {
    next(error);
  }
};

export const updateTrabajadorSST = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { contratistaId: _cid, ...fields } = pickTrabajadorFields(req.body) as Record<string, unknown>;
    const data = await prisma.trabajadorSST.update({
      where: { id },
      data: fields as Parameters<typeof prisma.trabajadorSST.update>[0]['data'],
      include: { contratista: { select: { id: true, razonSocial: true } } },
    });
    res.json({ success: true, message: 'Trabajador SST actualizado', data });
  } catch (error) {
    next(error);
  }
};

export const deleteTrabajadorSST = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.trabajadorSST.delete({ where: { id } });
    res.json({ success: true, message: 'Trabajador SST eliminado' });
  } catch (error) {
    next(error);
  }
};
