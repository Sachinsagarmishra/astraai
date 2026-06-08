import { Router } from 'express';
import { PalmReadingController } from '../controllers/PalmReadingController.js';

const router = Router();

router.post('/palm-reading', PalmReadingController.readPalm);

export default router;
