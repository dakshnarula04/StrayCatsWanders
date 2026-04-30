import { Router } from 'express';
import { journalController } from '../controllers/journalController';
import { upload, processImage } from '../middleware/upload';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/',           journalController.getAll);
router.get('/tags',       journalController.getTags);
router.get('/:id',        journalController.getById);
router.post('/',          requireAuth, upload.single('image'), processImage, journalController.create);
router.patch('/:id',      requireAuth, journalController.update);
router.delete('/:id',     requireAuth, journalController.delete);

export default router;
