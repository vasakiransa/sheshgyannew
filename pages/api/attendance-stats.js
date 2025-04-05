// pages/api/attendance-stats.js
import fs from "fs/promises";
import path from "path";

const attendanceFilePath = path.join(process.cwd(), "attendance.json");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const data = await fs.readFile(attendanceFilePath, "utf8");
      const attendanceStats = JSON.parse(data);
      res.status(200).json(attendanceStats);
    } catch (error) {
      console.error("Error reading attendance stats:", error);
      res.status(500).json({ message: "Failed to fetch attendance stats" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
