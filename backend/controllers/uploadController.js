const { getUploadedFileById } = require("../services/uploadStore");

function buildContentDisposition(filename, asAttachment) {
  const fallback = "file";
  const cleanName = String(filename || fallback).replace(/["\r\n]/g, "");
  const encoded = encodeURIComponent(cleanName);
  const type = asAttachment ? "attachment" : "inline";
  return `${type}; filename="${cleanName}"; filename*=UTF-8''${encoded}`;
}

async function getFile(req, res) {
  const id = Number(req.params.id);
  const asAttachment = String(req.query.download || "").toLowerCase() === "1";

  try {
    const file = await getUploadedFileById(id);
    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }

    res.setHeader("Content-Type", file.mime_type || "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      buildContentDisposition(file.original_name || `file-${id}`, asAttachment)
    );
    res.setHeader("Content-Length", String(file.byte_size || file.file_data.length));
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.status(200).send(file.file_data);
  } catch (error) {
    console.error("Get uploaded file error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = { getFile };
