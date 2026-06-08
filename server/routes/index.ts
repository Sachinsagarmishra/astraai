import { Router } from 'express';
import { PalmReadingController } from '../controllers/PalmReadingController.js';
import adminRouter from './admin.js';
import { query } from '../db/index.js';

const router = Router();

// Public Palm Reading API
router.post('/palm-reading', PalmReadingController.readPalm);

// Public App Config API for Expo Go app version check and notifications
router.get('/app-config', async (req, res) => {
  try {
    const config = await query('SELECT * FROM app_config ORDER BY id DESC LIMIT 1');
    res.json(config[0] || {
      min_app_version: '1.0.0',
      current_app_version: '1.0.0',
      force_update: 0,
      update_url: 'https://play.google.com/store',
      announcement_title: '',
      announcement_message: '',
      show_announcement: 0,
      maintenance_mode: 0
    });
  } catch (err) {
    console.error('Failed to load app config:', err);
    res.status(500).json({ error: 'Failed to load app config' });
  }
});

// Admin dashboard endpoints
router.use('/admin', adminRouter);

export default router;
