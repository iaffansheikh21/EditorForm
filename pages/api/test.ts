import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/app/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.status(200).json({ success: true, timestamp: result.rows[0].now });
  } catch (err) {
    console.error('Database connection failed:', err);
    res.status(500).json({ success: false, error: 'Database connection failed' });
  }
}