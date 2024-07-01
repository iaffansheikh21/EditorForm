// pages/api/saveData.js

import pool from "@/app/lib/db";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'diccsfwqj',
  api_key: '976631675411787',
  api_secret: 'LaNXwH47_SMalhXEW61P8sWl4MY'
});

export default async function handler(req : any, res : any) {
  if (req.method === 'POST') {
    const { title, description, imageString } = req.body;

    try {
      // Upload image to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(imageString, {
        folder: 'your_folder_name', // Optional: Set a folder name in Cloudinary
        resource_type: 'auto' // Automatically detect the image type
      });

      // Save data in your database with cloudinaryResponse.secure_url (the image URL)
      const articleData = `${title},${description},${cloudinaryResponse.secure_url}`;

      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO editor_data (article_data) VALUES ($1) RETURNING data_id',
        [articleData]
      );
      client.release();
      
      res.status(200).json({ message: 'Data saved successfully', dataId: result.rows[0].data_id });
    } catch (error) {
      console.error('Error saving data and uploading image:', error);
      res.status(500).json({ error: 'Failed to save data and upload image' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}