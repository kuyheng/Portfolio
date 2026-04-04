const pool = require("../config/db");

const API_UPLOAD_PATH = "/api/uploads/";

function extractUploadId(fileUrl) {
  const match = String(fileUrl || "").match(/^\/api\/uploads\/(\d+)(?:$|[/?#])/);
  return match ? Number(match[1]) : null;
}

async function saveUploadedFile(file) {
  if (!file || !Buffer.isBuffer(file.buffer)) {
    throw new Error("Invalid uploaded file buffer.");
  }

  const result = await pool.query(
    `INSERT INTO uploaded_files (original_name, mime_type, byte_size, file_data)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [
      file.originalname || "upload.bin",
      file.mimetype || "application/octet-stream",
      file.size || file.buffer.length,
      file.buffer,
    ]
  );

  const id = result.rows[0].id;
  return {
    id,
    fileUrl: `${API_UPLOAD_PATH}${id}`,
  };
}

async function getUploadedFileById(id) {
  const result = await pool.query(
    `SELECT id, original_name, mime_type, byte_size, file_data, created_at
     FROM uploaded_files
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  extractUploadId,
  saveUploadedFile,
  getUploadedFileById,
};
