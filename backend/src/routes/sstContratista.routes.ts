import { Router } from 'express';
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

const router = Router();

// ── Trabajadores SST (rutas fijas primero para evitar conflicto con /:id) ─────
router.get('/trabajadores', getTrabajadoresSST);
router.get('/trabajadores/:id', getTrabajadorSSTById);
router.post('/trabajadores', createTrabajadorSST);
router.put('/trabajadores/:id', updateTrabajadorSST);
router.delete('/trabajadores/:id', deleteTrabajadorSST);

// ── Contratistas SST ──────────────────────────────────────────────────────────
router.get('/all', getAllContratistasSST);
router.get('/', getContratistasSST);
router.get('/:id', getContratistaSSTById);
router.post('/', createContratistaSST);
router.put('/:id', updateContratistaSST);
router.delete('/:id', deleteContratistaSST);

export default router;
