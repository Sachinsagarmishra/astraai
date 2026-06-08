import { getDbType, execute } from './index.js';

async function runSetup() {
  const dbType = getDbType();
  console.log(`Setting up database for: ${dbType.toUpperCase()}`);

  try {
    if (dbType === 'sqlite') {
      // SQLite Queries
      await execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await execute(`
        CREATE TABLE IF NOT EXISTS palm_readings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          reading_text TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id)
        );
      `);

      await execute(`
        CREATE TABLE IF NOT EXISTS jaaps (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          mantra TEXT NOT NULL,
          count INTEGER DEFAULT 0,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id)
        );
      `);

      await execute(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          plan TEXT NOT NULL,
          status TEXT NOT NULL,
          FOREIGN KEY(user_id) REFERENCES users(id)
        );
      `);

      await execute(`
        CREATE TABLE IF NOT EXISTS app_config (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          min_app_version TEXT DEFAULT '1.0.0',
          current_app_version TEXT DEFAULT '1.0.0',
          force_update INTEGER DEFAULT 0,
          update_url TEXT,
          announcement_title TEXT DEFAULT '',
          announcement_message TEXT,
          show_announcement INTEGER DEFAULT 0,
          maintenance_mode INTEGER DEFAULT 0,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } else {
      // MySQL Queries
      await execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await execute(`
        CREATE TABLE IF NOT EXISTS palm_readings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          reading_text LONGTEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
        );
      `);

      await execute(`
        CREATE TABLE IF NOT EXISTS jaaps (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          mantra VARCHAR(255) NOT NULL,
          count INT DEFAULT 0,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      await execute(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          plan VARCHAR(100) NOT NULL,
          status VARCHAR(100) NOT NULL,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      await execute(`
        CREATE TABLE IF NOT EXISTS app_config (
          id INT AUTO_INCREMENT PRIMARY KEY,
          min_app_version VARCHAR(20) DEFAULT '1.0.0',
          current_app_version VARCHAR(20) DEFAULT '1.0.0',
          force_update TINYINT(1) DEFAULT 0,
          update_url TEXT,
          announcement_title VARCHAR(255) DEFAULT '',
          announcement_message TEXT,
          show_announcement TINYINT(1) DEFAULT 0,
          maintenance_mode TINYINT(1) DEFAULT 0,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `);
    }

    // Seed default App Configuration if none exists
    const existingConfig = await execute('SELECT id FROM app_config LIMIT 1');
    const configRows = Array.isArray(existingConfig) ? existingConfig : [];
    if (configRows.length === 0) {
      console.log('Seeding default app configuration...');
      await execute(`
        INSERT INTO app_config (
          min_app_version, current_app_version, force_update, update_url, 
          announcement_title, announcement_message, show_announcement, maintenance_mode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, ['1.0.0', '1.0.0', 0, 'https://play.google.com/store', 'Welcome to Astrai', 'Connect with the divine. मन से, डर से नहीं।', 1, 0]);
    }

    console.log("Database setup complete successfully!");
  } catch (error) {
    console.error("Failed to setup database tables:", error);
    process.exit(1);
  }
}

runSetup();
