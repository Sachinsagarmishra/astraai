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

// GET all announcements
router.get('/announcements', async (req, res) => {
  try {
    const list = await query('SELECT * FROM announcements ORDER BY id DESC');
    res.json(list);
  } catch (err) {
    console.error('Failed to load announcements:', err);
    res.status(500).json({ error: 'Failed to load announcements' });
  }
});

// POST create announcement
router.post('/announcements', async (req, res) => {
  const { title, message, image_url, is_active } = req.body;
  try {
    if (is_active) {
      await execute('UPDATE announcements SET is_active = 0');
    }
    const result = await execute(
      'INSERT INTO announcements (title, message, image_url, is_active) VALUES (?, ?, ?, ?)',
      [title || '', message || '', image_url || null, is_active ? 1 : 0]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error('Failed to create announcement:', err);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// PUT update announcement
router.put('/announcements/:id', async (req, res) => {
  const { id } = req.params;
  const { title, message, image_url, is_active } = req.body;
  try {
    if (is_active) {
      await execute('UPDATE announcements SET is_active = 0');
    }
    await execute(
      'UPDATE announcements SET title = ?, message = ?, image_url = ?, is_active = ? WHERE id = ?',
      [title || '', message || '', image_url || null, is_active ? 1 : 0, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update announcement:', err);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// DELETE announcement
router.delete('/announcements/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await execute('DELETE FROM announcements WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete announcement:', err);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

// POST activate announcement (Set Immediate)
router.post('/announcements/:id/activate', async (req, res) => {
  const { id } = req.params;
  try {
    await execute('UPDATE announcements SET is_active = 0');
    await execute('UPDATE announcements SET is_active = 1 WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to activate announcement:', err);
    res.status(500).json({ error: 'Failed to activate announcement' });
  }
});

// --- User Profiles (Admin) ---

// GET all user profiles
router.get('/user-profiles', async (req, res) => {
  try {
    const profiles = await query('SELECT * FROM user_profiles ORDER BY created_at DESC');
    res.json(profiles);
  } catch (err) {
    console.error('Failed to fetch user profiles:', err);
    res.status(500).json({ error: 'Failed to fetch user profiles' });
  }
});

// GET a single user profile by phone
router.get('/user-profiles/:phone', async (req, res) => {
  const { phone } = req.params;
  try {
    const rows = await query('SELECT * FROM user_profiles WHERE phone = ?', [phone]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (err) {
    console.error('Failed to fetch user profile:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

export default router;
