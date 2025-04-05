// pages/api/save-attendance-stats.js
import fs from "fs/promises";
import path from "path";

const attendanceFilePath = path.join(process.cwd(), "attendance.json");

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const stats = req.body;
      await fs.writeFile(attendanceFilePath, JSON.stringify(stats, null, 2));
      res.status(200).json({ message: "Attendance stats saved successfully" });
    } catch (error) {
      console.error("Error saving attendance stats:", error);
      res.status(500).json({ message: "Failed to save attendance stats" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
