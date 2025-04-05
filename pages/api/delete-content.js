import fs from "fs";
import path from "path";

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { courseId, pageNumber, contentType } = req.body;

        if (!courseId || !pageNumber) {
            return res.status(400).json({ error: "courseId and pageNumber are required." });
        }

        const courseDir = path.join(process.cwd(), "data", "course-content", courseId);

        if (!fs.existsSync(courseDir)) {
            return res.status(404).json({ error: "Course not found." });
        }

        let filePath;
        if (contentType === "quiz") {
            filePath = path.join(courseDir, `page-${pageNumber}.quiz.json`);
            if (fs.existsSync(filePath)) {
                const quizData = JSON.parse(fs.readFileSync(filePath, "utf8"));
                quizData.quiz.options.forEach(opt => {
                    if (opt.type === "image" && opt.value) {
                        const imagePath = path.join(process.cwd(), "public", opt.value);
                        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
                    }
                });
            }
        } else {
            filePath = path.join(courseDir, `page-${pageNumber}.info.json`);
            if (fs.existsSync(filePath) && (contentType === "video" || contentType === "asset")) {
                const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
                const filePathToDelete = path.join(process.cwd(), "public", data.url);
                if (fs.existsSync(filePathToDelete)) fs.unlinkSync(filePathToDelete);
            }
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted content at: ${filePath}`);
            res.status(200).json({ success: true });
        } else {
            return res.status(404).json({ error: "Content not found." });
        }
    } catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({ error: "Failed to delete content.", details: error.message });
    }
}