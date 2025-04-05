// pages/api/saveQuiz.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const data = req.body; // Data received from the client (quiz data with courseId)

            if (!data || typeof data !== 'object') {
                return res.status(400).json({ error: 'Invalid data format. Expected an object.' });
            }

            const filePath = path.join(process.cwd(), 'data', 'quiz.json'); // Path to quiz.json
            let existingData = {};

            // Read existing data from the file (if it exists)
            try {
                const fileContents = fs.readFileSync(filePath, 'utf8');
                existingData = JSON.parse(fileContents);
            } catch (error) {
                // If the file doesn't exist or there's an error reading it, assume it's empty
                console.log('quiz.json not found or empty, creating new file.');
            }

            // Merge the new data with the existing data
            const newData = { ...existingData, ...data };

            // Write the updated data back to the file
            fs.writeFileSync(filePath, JSON.stringify(newData, null, 2)); // Use `null, 2` for pretty printing

            res.status(200).json({ message: 'Quiz saved successfully!' });
        } catch (error) {
            console.error('Error saving quiz:', error);
            res.status(500).json({ error: 'Failed to save quiz.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.  Use POST.' });
    }
}
