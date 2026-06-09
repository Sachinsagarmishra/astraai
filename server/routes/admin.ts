import { Router } from 'express';
import { execute, query } from '../db/index.js';

const router = Router();

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Mercedes@001';
  
  if (username === adminUsername && password === adminPassword) {
    res.json({ token: 'admin-session-token-astrai-2026' });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Admin Stats
router.get('/stats', async (req, res) => {
  try {
    const usersCount = await query('SELECT COUNT(*) as count FROM users');
    const readingsCount = await query('SELECT COUNT(*) as count FROM palm_readings');
    const subsCount = await query('SELECT COUNT(*) as count FROM subscriptions');

    const recentUsers = await query('SELECT id, email, created_at FROM users ORDER BY created_at DESC LIMIT 10');
    
    // Check db type for snippet extraction
    const recentReadings = await query(
      'SELECT id, user_id, created_at, reading_text FROM palm_readings ORDER BY created_at DESC LIMIT 10'
    );

    // Map readings to include a safe snippet
    const formattedReadings = recentReadings.map((r: any) => ({
      id: r.id,
      user_id: r.user_id,
      created_at: r.created_at,
      snippet: r.reading_text ? r.reading_text.substring(0, 100) + '...' : ''
    }));

    res.json({
      totalUsers: usersCount[0]?.count || 0,
      totalPalmReadings: readingsCount[0]?.count || 0,
      totalSubscriptions: subsCount[0]?.count || 0,
      recentUsers,
      recentReadings: formattedReadings,
    });
  } catch (err) {
    console.error('Failed to fetch stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get App Config
router.get('/config', async (req, res) => {
  try {
    const config = await query('SELECT * FROM app_config ORDER BY id DESC LIMIT 1');
    res.json(config[0] || {});
  } catch (err) {
    console.error('Failed to fetch app config:', err);
    res.status(500).json({ error: 'Failed to fetch app config' });
  }
});

// Update App Config
router.post('/config', async (req, res) => {
  const {
    min_app_version,
    current_app_version,
    force_update,
    update_url,
    announcement_title,
    announcement_message,
    show_announcement,
    maintenance_mode,
  } = req.body;

  try {
    const rows = await query('SELECT id FROM app_config LIMIT 1');
    
    if (rows.length > 0) {
      const id = rows[0].id;
      await execute(
        `UPDATE app_config SET 
          min_app_version = ?, 
          current_app_version = ?, 
          force_update = ?, 
          update_url = ?, 
          announcement_title = ?, 
          announcement_message = ?, 
          show_announcement = ?, 
          maintenance_mode = ?
         WHERE id = ?`,
        [
          min_app_version || '1.0.0',
          current_app_version || '1.0.0',
          force_update ? 1 : 0,
          update_url || '',
          announcement_title || '',
          announcement_message || '',
          show_announcement ? 1 : 0,
          maintenance_mode ? 1 : 0,
          id
        ]
      );
    } else {
      await execute(
        `INSERT INTO app_config (
          min_app_version, current_app_version, force_update, update_url, 
          announcement_title, announcement_message, show_announcement, maintenance_mode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          min_app_version || '1.0.0',
          current_app_version || '1.0.0',
          force_update ? 1 : 0,
          update_url || '',
          announcement_title || '',
          announcement_message || '',
          show_announcement ? 1 : 0,
          maintenance_mode ? 1 : 0
        ]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update app config:', err);
    res.status(500).json({ error: 'Failed to update app config' });
  }
});

export default router;
