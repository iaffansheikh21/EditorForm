// pages/api/deleteData.js

import pool from "@/app/lib/db";

export default async function handler(req : any, res : any) {
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    try {
      const client = await pool.connect();
      const result = await client.query('DELETE FROM editor_data WHERE data_id = $1 RETURNING *', [id]);
      client.release();

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Data not found' });
      }

      res.status(200).json({ message: 'Data deleted successfully', deletedData: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Database deletion error', details: (error as Error).message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}