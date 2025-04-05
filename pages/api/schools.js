import fs from 'fs';
import path from 'path'; // Assuming you have a database connection setup

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const schools = await db.query(
        'SELECT id, first_name AS name FROM users WHERE role = ?',
        ['school']
      );
      res.status(200).json(schools);
    } catch (error) {
      console.error('Error fetching schools:', error);
      res.status(500).json({ message: 'Failed to fetch schools', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
