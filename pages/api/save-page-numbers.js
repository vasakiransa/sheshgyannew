const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const infoFilePath = 'info.json';

// Helper function to safely read and parse JSON
const safeReadFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.warn(`File not found or invalid JSON, returning empty object`);
        return {}; // Return an empty object
    }
};

// Helper function to safely write JSON to file
const safeWriteFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing to ${filePath}:`, error);
        return false;
    }
};

app.post('/api/save-content', (req, res) => {
    try {
        const { courseId, pageNumber, contentType, contentData } = req.body;

        if (!courseId || !pageNumber || !contentType) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const infoData = safeReadFile(infoFilePath);

        // Ensure courseId exists
        infoData[courseId] = infoData[courseId] || {};

        // Update the content
        infoData[courseId][contentType] = {
            pageNumber: pageNumber,
            contentData: contentData || {}, // Ensure contentData exists
        };

        if (safeWriteFile(infoFilePath, infoData)) {
            res.status(200).json({ success: true, message: 'Content saved successfully!' });
        } else {
            res.status(500).json({ success: false, error: 'Failed to write to file' });
        }
    } catch (error) {
        console.error('Error saving content:', error);
        res.status(500).json({ success: false, error: 'Failed to save content' });
    }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
