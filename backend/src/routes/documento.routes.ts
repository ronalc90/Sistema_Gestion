import { Router } from 'express';
import * as ctrl from '../controllers/documento.controller';
import { upload } from '../middleware/upload';
import { devAuth } from '../middleware/devAuth';

const router = Router();

router.get('/', ctrl.getDocumentos);
router.get('/:id', ctrl.getDocumentoById);
router.get('/:id/download', ctrl.downloadDocumento);
router.post('/', devAuth, upload.single('file'), ctrl.createDocumento);
router.put('/:id', ctrl.updateDocumento);
router.delete('/:id', ctrl.deleteDocumento);

export default router;
