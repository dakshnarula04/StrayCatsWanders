import { Router } from 'express';
import { tripController } from '../controllers/tripController';
import { requireAuth } from '../middleware/requireAuth';
import { upload, processImage } from '../middleware/upload';

const router = Router();

router.get('/', tripController.getAll);

// Protected routes (Admin only)
router.post('/', requireAuth, upload.single('image'), processImage, tripController.create);
router.patch('/:id', requireAuth, tripController.update);
router.delete('/:id', requireAuth, tripController.delete);

export default router;
