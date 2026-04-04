const path = require("path");
const fs = require("fs");
const pool = require("../config/db");
const {
  extractUploadId,
  getUploadedFileById,
  saveUploadedFile,
} = require("../services/uploadStore");

function resolveLegacyUploadPath(fileUrl) {
  const cleanPath = fileUrl.replace(/^\/+/, "");
  return path.join(__dirname, "..", cleanPath);
}

function buildAttachmentHeader(fileName) {
  const safeName = String(fileName || "download").replace(/["\r\n]/g, "");
  const encodedName = encodeURIComponent(safeName);
  return `attachment; filename="${safeName}"; filename*=UTF-8''${encodedName}`;
}

async function trySendStoredFile(res, fileUrl, fileName) {
  const uploadId = extractUploadId(fileUrl);
  if (!uploadId) return false;

  const storedFile = await getUploadedFileById(uploadId);
  if (!storedFile) return false;

  res.setHeader("Content-Type", storedFile.mime_type || "application/octet-stream");
  res.setHeader(
    "Content-Disposition",
    buildAttachmentHeader(fileName || storedFile.original_name || "cv.pdf")
  );
  res.setHeader("Content-Length", String(storedFile.byte_size || storedFile.file_data.length));
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(storedFile.file_data);
  return true;
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

    const sentFromDb = await trySendStoredFile(res, cv.file_url, cv.file_name || "cv.pdf");
    if (sentFromDb) return;

    const filePath = resolveLegacyUploadPath(cv.file_url);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "CV file not found." });
    }

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

  try {
    const storedFile = await saveUploadedFile(req.file);
    const fileUrl = storedFile.fileUrl;
    const fileName = req.file.originalname;

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
