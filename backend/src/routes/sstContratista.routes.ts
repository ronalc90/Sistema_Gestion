import { Router } from 'express';
import multer from 'multer';
import {
  getAllContratistasSST,
  getContratistasSST,
  getContratistaSSTById,
  createContratistaSST,
  updateContratistaSST,
  deleteContratistaSST,
  getTrabajadoresSST,
  getTrabajadorSSTById,
  createTrabajadorSST,
  updateTrabajadorSST,
  deleteTrabajadorSST,
} from '../controllers/sstContratista.controller';
import {
  getSoportes,
  uploadSoporte,
  getSoporteUrl,
  deleteSoporte,
  getSoportesTrabajador,
  uploadSoporteTrabajador,
} from '../controllers/sstSoportes.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB

// ── Trabajadores SST (rutas fijas primero para evitar conflicto con /:id) ─────
router.get('/trabajadores', getTrabajadoresSST);
router.get('/trabajadores/:id', getTrabajadorSSTById);
router.post('/trabajadores', createTrabajadorSST);
router.put('/trabajadores/:id', updateTrabajadorSST);
router.delete('/trabajadores/:id', deleteTrabajadorSST);

// ── Soportes ──────────────────────────────────────────────────────────────────
router.get('/soportes/:soporteId/url', getSoporteUrl);
router.delete('/soportes/:soporteId', deleteSoporte);
router.get('/trabajadores/:trabajadorId/soportes', getSoportesTrabajador);
router.post('/trabajadores/:trabajadorId/soportes', upload.single('archivo'), uploadSoporteTrabajador);

// ── Contratistas SST ──────────────────────────────────────────────────────────
router.get('/all', getAllContratistasSST);
router.get('/', getContratistasSST);
router.get('/:id', getContratistaSSTById);
router.post('/', createContratistaSST);
router.put('/:id', updateContratistaSST);
router.delete('/:id', deleteContratistaSST);
router.get('/:contratistaId/soportes', getSoportes);
router.post('/:contratistaId/soportes', upload.single('archivo'), uploadSoporte);

export default router;
