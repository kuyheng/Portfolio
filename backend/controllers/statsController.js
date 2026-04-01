const pool = require("../config/db");

async function getStats(req, res) {
  try {
    const [projects, skills, cv, contacts] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM projects"),
      pool.query("SELECT COUNT(*) FROM skills"),
      pool.query("SELECT COALESCE(SUM(download_count), 0) AS total FROM cv"),
      pool.query("SELECT COUNT(*) FROM contacts WHERE is_read = FALSE"),
    ]);

    return res.status(200).json({
      totalProjects: Number(projects.rows[0].count),
      totalSkills: Number(skills.rows[0].count),
      cvDownloads: Number(cv.rows[0].total),
      unreadMessages: Number(contacts.rows[0].count),
    });
  } catch (error) {
    console.error("Stats error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = { getStats };
