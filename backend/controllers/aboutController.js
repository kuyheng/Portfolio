const pool = require("../config/db");

const parsePayload = (body) => {
  if (!body) return null;
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  return body;
};

async function getAbout(req, res) {
  try {
    const result = await pool.query(
      "SELECT data FROM about_settings ORDER BY updated_at DESC LIMIT 1"
    );
    if (!result.rows.length) {
      return res.status(200).json({ about: null });
    }
    const about = result.rows[0].data || null;
    if (about) {
      delete about.features;
      delete about.journey;
      delete about.toolbox;
    }
    return res.status(200).json({ about });
  } catch (error) {
    console.error("Get about error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function updateAbout(req, res) {
  const payload = parsePayload(req.body.data || req.body);
  if (!payload || typeof payload !== "object") {
    return res.status(400).json({ message: "Invalid about payload." });
  }

  try {
    if (req.file) {
      payload.hero = payload.hero || {};
      payload.hero.avatar = payload.hero.avatar || {};
      payload.hero.avatar.src = `/uploads/${req.file.filename}`;
    }

    // Strip sections that are no longer used in the UI
    delete payload.features;
    delete payload.journey;
    delete payload.toolbox;

    const result = await pool.query(
      `INSERT INTO about_settings (id, data, updated_at)
       VALUES (1, $1, NOW())
       ON CONFLICT (id) DO UPDATE
       SET data = EXCLUDED.data,
           updated_at = NOW()
       RETURNING data`,
      [payload]
    );
    return res.status(200).json({ about: result.rows[0].data });
  } catch (error) {
    console.error("Update about error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = { getAbout, updateAbout };
