// pages/api/getData.js

import pool from '@/app/lib/db';
import { v2 as cloudinary } from 'cloudinary';
import { htmlToText } from 'html-to-text';

cloudinary.config({
  cloud_name: 'diccsfwqj',
  api_key: '976631675411787',
  api_secret: 'LaNXwH47_SMalhXEW61P8sWl4MY'
});

export default async function handler(req : any, res : any) {
  res.setHeader('Cache-Control', 'no-store'); // Prevent caching

  if (req.method === 'GET') {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM editor_data');
      client.release();

      const formattedData = await Promise.all(result.rows.map(async row => {
        const [title, description, imageCloudinaryUrl] = row.article_data.split(',');

        try {
          // Construct the image URL using Cloudinary SDK
          const imageResponse = await cloudinary.url(imageCloudinaryUrl, { secure: true });

          return {
            ...row,
            title: htmlToText(title),
            description: htmlToText(description),
            imageString: imageResponse, // Cloudinary image URL
          };
        } catch (error) {
          console.error('Error fetching image from Cloudinary:', error);
          return {
            ...row,
            title: htmlToText(title),
            description: htmlToText(description),
            imageString: '', // Handle case where image fetch fails
          };
        }
      }));

      res.status(200).json(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}