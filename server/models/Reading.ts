import { execute } from '../db/index.js';

export interface Reading {
  id?: number;
  user_id?: number;
  reading_text: string;
  created_at?: string;
}

export class ReadingModel {
  static async create(data: { reading_text: string; user_id?: number }): Promise<number | bigint> {
    const result = await execute(
      'INSERT INTO palm_readings (reading_text, user_id) VALUES (?, ?)',
      [data.reading_text, data.user_id || null]
    );
    return result.insertId;
  }
}
