import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const { courseId } = req.query;

    try {
        const basePath = path.join(process.cwd(), "data", "course-content");
        const coursePath = path.join(basePath, courseId);
        const content = [];
        let pageNum = 1;

        while (true) {
            const infoFilePath = path.join(coursePath, `page-${pageNum}.info.json`);
            const quizFilePath = path.join(coursePath, `page-${pageNum}.quiz.json`);
            let pageContent = null;

            if (fs.existsSync(infoFilePath)) {
                pageContent = JSON.parse(fs.readFileSync(infoFilePath, "utf8"));
                if ("video" in pageContent) {
                    content.push({ pageNumber: pageNum.toString(), contentType: "video", contentData: pageContent });
                } else if ("text" in pageContent) {
                    content.push({ pageNumber: pageNum.toString(), contentType: "text", contentData: pageContent });
                } else if ("simulator" in pageContent) {
                    content.push({ pageNumber: pageNum.toString(), contentType: "simulator", contentData: pageContent });
                } else if ("url" in pageContent && !("video" in pageContent)) {
                    content.push({ pageNumber: pageNum.toString(), contentType: "asset", contentData: pageContent });
                }
            } else if (fs.existsSync(quizFilePath)) {
                pageContent = JSON.parse(fs.readFileSync(quizFilePath, "utf8"));
                content.push({ pageNumber: pageNum.toString(), contentType: "quiz", contentData: pageContent });
            } else {
                break;
            }
            pageNum++;
        }

        res.status(200).json({ content });
    } catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).json({ error: "Failed to fetch content" });
    }
}