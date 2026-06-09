import { Router, Request, Response } from 'express';
import { PalmReadingController } from '../controllers/PalmReadingController.js';
import adminRouter from './admin.js';
import { query, execute } from '../db/index.js';

const router = Router();

// --- Security Helpers ---

// Sanitize text input: strip HTML/script tags, trim whitespace
function sanitize(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')          // Strip HTML tags
    .replace(/&lt;/g, '<')            // Decode HTML entities for re-strip
    .replace(/&gt;/g, '>')
    .replace(/<[^>]*>/g, '')          // Re-strip after decode
    .replace(/javascript:/gi, '')     // Remove JS protocol
    .replace(/on\w+\s*=/gi, '')       // Remove event handlers
    .trim();
}

// Simple in-memory rate limiter (per IP, 5 requests/minute)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(req: Request, res: Response, limit: number = 5, windowMs: number = 60000): boolean {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false; // Not rate limited
  }

  entry.count++;
  if (entry.count > limit) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return true; // Rate limited
  }

  return false;
}

// Allowed values for enum fields
const VALID_GENDERS = ['Male', 'Female', 'Other'];
const VALID_MARITAL = ['Single', 'Married', 'Divorced', 'Widowed'];
const VALID_CONCERNS = ['Career', 'Love', 'Health', 'Finance', 'Spiritual Growth', 'Family'];
const VALID_LANGUAGES = ['Hindi', 'English', 'Both'];

// --- Public Routes ---

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

// --- User Profile Routes (Onboarding Questionnaire) ---

// POST /api/profile — Create user profile from onboarding questionnaire
router.post('/profile', async (req: Request, res: Response) => {
  // Rate limiting
  if (rateLimit(req, res)) return;

  try {
    const {
      phone,
      full_name,
      gender,
      date_of_birth,
      birth_time,
      birth_place,
      marital_status,
      primary_concerns,
      preferred_language,
    } = req.body;

    // --- Validation ---
    const errors: string[] = [];

    // Phone: required, 10 digits
    if (!phone || !/^\d{10}$/.test(phone)) {
      errors.push('Valid 10-digit phone number is required.');
    }

    // Full name: required, 2-100 chars
    const cleanName = sanitize(full_name);
    if (!cleanName || cleanName.length < 2 || cleanName.length > 100) {
      errors.push('Full name must be 2-100 characters.');
    }

    // Gender: must be from allowed list
    if (!gender || !VALID_GENDERS.includes(gender)) {
      errors.push(`Gender must be one of: ${VALID_GENDERS.join(', ')}.`);
    }

    // Date of birth: required, valid date format
    if (!date_of_birth || !/^\d{4}-\d{2}-\d{2}$/.test(date_of_birth)) {
      errors.push('Date of birth is required (YYYY-MM-DD format).');
    } else {
      const dob = new Date(date_of_birth);
      const now = new Date();
      if (isNaN(dob.getTime()) || dob > now) {
        errors.push('Date of birth must be a valid past date.');
      }
    }

    // Birth time: optional, HH:MM format
    if (birth_time && !/^\d{2}:\d{2}$/.test(birth_time)) {
      errors.push('Birth time must be in HH:MM format.');
    }

    // Birth place: required, 2-100 chars
    const cleanPlace = sanitize(birth_place);
    if (!cleanPlace || cleanPlace.length < 2 || cleanPlace.length > 100) {
      errors.push('Birth place must be 2-100 characters.');
    }

    // Marital status: must be from allowed list
    if (!marital_status || !VALID_MARITAL.includes(marital_status)) {
      errors.push(`Marital status must be one of: ${VALID_MARITAL.join(', ')}.`);
    }

    // Primary concerns: must be comma-separated valid values
    if (!primary_concerns || typeof primary_concerns !== 'string') {
      errors.push('At least one primary concern is required.');
    } else {
      const concerns = primary_concerns.split(',').map((c: string) => c.trim());
      const invalid = concerns.filter((c: string) => !VALID_CONCERNS.includes(c));
      if (invalid.length > 0) {
        errors.push(`Invalid concerns: ${invalid.join(', ')}. Valid: ${VALID_CONCERNS.join(', ')}.`);
      }
    }

    // Language
    const lang = preferred_language || 'English';
    if (!VALID_LANGUAGES.includes(lang)) {
      errors.push(`Language must be one of: ${VALID_LANGUAGES.join(', ')}.`);
    }

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    // --- Upsert Profile (INSERT or UPDATE on conflict) ---
    // Check if profile already exists
    const existing = await query('SELECT id FROM user_profiles WHERE phone = ?', [phone]);

    if (existing.length > 0) {
      // Update
      await execute(
        `UPDATE user_profiles SET 
          full_name = ?, gender = ?, date_of_birth = ?, birth_time = ?,
          birth_place = ?, marital_status = ?, primary_concerns = ?,
          preferred_language = ?, profile_completed = 1
        WHERE phone = ?`,
        [cleanName, gender, date_of_birth, birth_time || null, cleanPlace, marital_status, primary_concerns, lang, phone]
      );
    } else {
      // Insert
      await execute(
        `INSERT INTO user_profiles (
          phone, full_name, gender, date_of_birth, birth_time,
          birth_place, marital_status, primary_concerns, preferred_language, profile_completed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [phone, cleanName, gender, date_of_birth, birth_time || null, cleanPlace, marital_status, primary_concerns, lang]
      );
    }

    res.json({ success: true, message: 'Profile saved successfully.' });
  } catch (err: any) {
    console.error('Failed to save user profile:', err);
    res.status(500).json({ error: 'Failed to save profile. Please try again.' });
  }
});

// GET /api/profile/:phone — Check if profile exists for a phone number
router.get('/profile/:phone', async (req: Request, res: Response) => {
  const { phone } = req.params;

  if (!phone || !/^\d{10}$/.test(phone)) {
    res.status(400).json({ error: 'Valid 10-digit phone number is required.' });
    return;
  }

  try {
    const rows = await query('SELECT * FROM user_profiles WHERE phone = ?', [phone]);
    if (rows.length > 0) {
      res.json({ exists: true, profile: rows[0] });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error('Failed to fetch profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// Admin dashboard endpoints
router.use('/admin', adminRouter);

export default router;
