import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'quiz.json');

async function readQuizzes() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty object
    return {};
  }
}

async function writeQuizzes(quizzes) {
  await fs.writeFile(filePath, JSON.stringify(quizzes, null, 2), 'utf-8');
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const quizzes = await readQuizzes();
      res.status(200).json(quizzes);
    } catch (error) {
      res.status(500).json({ message: 'Error reading quizzes', error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const updatedQuizzes = req.body;
      await writeQuizzes(updatedQuizzes);
      res.status(200).json({ message: 'Quizzes updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating quizzes', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
