const path = require("path");
const pool = require("../config/db");

function resolveUploadPath(fileUrl) {
  const cleanPath = fileUrl.replace(/^\/+/, "");
  return path.join(__dirname, "..", cleanPath);
}

async function getCurrent(req, res) {
  try {
    const result = await pool.query("SELECT * FROM cv ORDER BY uploaded_at DESC LIMIT 1");
    if (!result.rows.length) {
      return res.status(404).json({ message: "CV not found." });
    }
    return res.status(200).json({ cv: result.rows[0] });
  } catch (error) {
    console.error("Get CV error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function download(req, res) {
  try {
    const result = await pool.query("SELECT * FROM cv ORDER BY uploaded_at DESC LIMIT 1");
    if (!result.rows.length) {
      return res.status(404).json({ message: "CV not found." });
    }
    const cv = result.rows[0];
    await pool.query("UPDATE cv SET download_count = download_count + 1 WHERE id = $1", [
      cv.id,
    ]);
    const filePath = resolveUploadPath(cv.file_url);
    return res.download(filePath, cv.file_name || "cv.pdf");
  } catch (error) {
    console.error("Download CV error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const fileName = req.file.originalname;

  try {
    const result = await pool.query(
      `INSERT INTO cv (file_url, file_name)
       VALUES ($1, $2)
       RETURNING *`,
      [fileUrl, fileName]
    );
    return res.status(201).json({ cv: result.rows[0] });
  } catch (error) {
    console.error("Upload CV error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = { getCurrent, download, upload };
