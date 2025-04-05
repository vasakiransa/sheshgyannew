// pages/api/timetable.js
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), './timetable.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { timetable } = req.body;

      if (!timetable || !Array.isArray(timetable)) {
        console.error('Invalid timetable data received:', timetable);
        return res.status(400).json({ message: 'Invalid timetable data.  Expected an array.' });
      }

      fs.writeFileSync(filePath, JSON.stringify(timetable, null, 2));
      res.status(200).json({ message: 'Timetable saved successfully' });
    } catch (error) {
      console.error('Error saving timetable:', error);
      res.status(500).json({ message: 'Failed to save timetable', error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        console.warn('Timetable file not found. Returning an empty array.');
        return res.status(200).json([]); // Return empty array if file doesn't exist
      }

      const data = fs.readFileSync(filePath, 'utf8');
      const timetable = JSON.parse(data);
      res.status(200).json(timetable);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      res.status(500).json({ message: 'Failed to fetch timetable', error: error.message }); // Corrected status code
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
