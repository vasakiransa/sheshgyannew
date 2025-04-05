import formidable from "formidable-serverless";
import fs from "fs";
import path from "path";

export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadDir = path.join(process.cwd(), "public/uploads");

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const form = new formidable.IncomingForm();
        form.uploadDir = uploadDir;
        form.keepExtensions = true;
        form.maxFileSize = 200 * 1024 * 1024; // 200MB

        await fs.promises.mkdir(uploadDir, { recursive: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Form parse error:", err);
                return res.status(500).json({ error: "File upload failed.", details: err.message });
            }

            const file = files.file;
            const folder = fields.folder;
            const pageNumber = fields.pageNumber;

            if (!file) {
                return res.status(400).json({ error: "No file uploaded." });
            }
            if (!folder) {
                return res.status(400).json({ error: "No folder specified." });
            }
            if (!pageNumber) {
                return res.status(400).json({ error: "No pageNumber specified." });
            }

            const targetDir = path.join(uploadDir, folder);
            await fs.promises.mkdir(targetDir, { recursive: true });

            const oldPath = file.path;
            const filename = file.name;
            const newPath = path.join(targetDir, filename);

            try {
                await fs.promises.rename(oldPath, newPath);
                const fileUrl = `/${path.relative(process.cwd() + "/public", newPath)}`;

                // Create JSON file for video (not for quiz images or assets)
                if (folder.includes("uploadedvideo")) {
                    const courseId = folder.split("/")[1];
                    const courseDir = path.join(process.cwd(), "data", "course-content", courseId);
                    await fs.promises.mkdir(courseDir, { recursive: true });
                    const jsonPath = path.join(courseDir, `page-${pageNumber}.info.json`);
                    const jsonData = { video: filename, url: fileUrl };
                    await fs.promises.writeFile(jsonPath, JSON.stringify(jsonData, null, 2));
                    console.log(`JSON file created at: ${jsonPath}`);
                }

                res.status(200).json({ fileUrl });
            } catch (moveError) {
                console.error("File move error:", moveError);
                await fs.promises.unlink(oldPath);
                res.status(500).json({ error: "File move failed.", details: moveError.message });
            }
        });
    } catch (e) {
        console.error("Unexpected error in upload:", e);
        res.status(500).json({ error: "An unexpected error occurred.", details: e.message });
    }
}