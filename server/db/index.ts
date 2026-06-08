import Database from 'better-sqlite3';
import mysql from 'mysql2/promise';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let dbType: 'sqlite' | 'mysql' = 'sqlite';
let sqliteDb: any = null;
let mysqlPool: any = null;

const isMysqlConfigured = process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME;

if (isMysqlConfigured) {
  dbType = 'mysql';
  console.log('Database configuration detected. Using MySQL connection pool.');
  mysqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
} else {
  dbType = 'sqlite';
  console.log('No MySQL configuration detected. Falling back to local SQLite.');
  const dbPath = path.resolve(process.cwd(), 'database.sqlite');
  sqliteDb = new Database(dbPath);
  sqliteDb.pragma('foreign_keys = ON');
}

export function getDbType(): 'sqlite' | 'mysql' {
  return dbType;
}

export async function execute(sql: string, params: any[] = []): Promise<any> {
  if (dbType === 'mysql') {
    const [result] = await mysqlPool.execute(sql, params);
    // Standardize MySQL insertId return structure
    if (result && typeof result === 'object' && 'insertId' in result) {
      return {
        insertId: result.insertId,
        affectedRows: result.affectedRows,
      };
    }
    return result;
  } else {
    const normalizedSql = sql.trim().toUpperCase();
    if (normalizedSql.startsWith('SELECT') || normalizedSql.startsWith('PRAGMA')) {
      const stmt = sqliteDb.prepare(sql);
      return stmt.all(...params);
    } else {
      const stmt = sqliteDb.prepare(sql);
      const result = stmt.run(...params);
      return {
        insertId: result.lastInsertRowid,
        affectedRows: result.changes,
      };
    }
  }
}

export async function query(sql: string, params: any[] = []): Promise<any[]> {
  const result = await execute(sql, params);
  if (dbType === 'mysql') {
    return Array.isArray(result) ? result : [];
  } else {
    return Array.isArray(result) ? result : [];
  }
}

export async function queryOne(sql: string, params: any[] = []): Promise<any | null> {
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0] : null;
}
