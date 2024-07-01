// pages/api/updateData.js

import pool from "@/app/lib/db";

export default async function handler(req : any, res : any) {
  if (req.method === 'PUT') {
    const { id, title, description, imageString } = req.body;
    if (!id || !title || !description) {
      return res.status(400).json({ error: 'ID, title, and description are required' });
    }

    try {
      // Split existing article_data to retrieve previous imageCloudinaryUrl if needed
      const client = await pool.connect();
      const existingData = await client.query(
        'SELECT article_data FROM editor_data WHERE data_id = $1',
        [id]
      );

      if (existingData.rows.length === 0) {
        client.release();
        return res.status(404).json({ error: 'Data not found' });
      }

      const [prevTitle, prevDescription, prevImageCloudinaryUrl] = existingData.rows[0].article_data.split(',');

      // Determine if the imageString is a base64 data or Cloudinary URL
      let updatedImageString = imageString;
      if (imageString.startsWith('data:')) {
        // Upload new image to Cloudinary
        const { v2: cloudinary } = require('cloudinary');
        cloudinary.config({
          cloud_name: 'diccsfwqj',
          api_key: '976631675411787',
          api_secret: 'LaNXwH47_SMalhXEW61P8sWl4MY'
        });

        const cloudinaryResponse = await cloudinary.uploader.upload(imageString, {
          folder: 'your_folder_name', // Optional: Set a folder name in Cloudinary
          resource_type: 'auto' // Automatically detect the image type
        });
        updatedImageString = cloudinaryResponse.secure_url;
      }

      // Update data in database
      const result = await client.query(
        'UPDATE editor_data SET article_data = $1 WHERE data_id = $2 RETURNING *',
        [`${title},${description},${updatedImageString}`, id]
      );
      client.release();

      res.status(200).json({ message: 'Data updated successfully', updatedData: result.rows[0] });
    } catch (error : any) {
      console.error('Error updating data:', error as Error);
      res.status(500).json({ error: 'Database update error', details: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}