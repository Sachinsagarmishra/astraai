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
    const activeAnnouncement = await query('SELECT * FROM announcements WHERE is_active = 1 ORDER BY id DESC LIMIT 1');

    const configData = config[0] || {
      min_app_version: '1.0.0',
      current_app_version: '1.0.0',
      force_update: 0,
      update_url: 'https://play.google.com/store',
      maintenance_mode: 0
    };

    res.json({
      ...configData,
      announcement_title: activeAnnouncement[0]?.title || '',
      announcement_message: activeAnnouncement[0]?.message || '',
      announcement_image: activeAnnouncement[0]?.image_url || '',
      show_announcement: activeAnnouncement.length > 0 ? 1 : 0
    });
  } catch (err) {
    console.error('Failed to load app config:', err);
    res.status(500).json({ error: 'Failed to load app config' });
  }
});

// Admin dashboard endpoints
router.use('/admin', adminRouter);

export default router;
