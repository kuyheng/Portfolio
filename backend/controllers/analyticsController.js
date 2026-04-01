const pool = require("../config/db");

function detectDevice(userAgent = "") {
  const ua = userAgent.toLowerCase();
  if (/bot|crawl|spider|slurp/.test(ua)) return "bot";
  if (/tablet|ipad|playbook|silk/.test(ua)) return "tablet";
  if (/mobi|android|iphone|ipod/.test(ua)) return "mobile";
  return "desktop";
}

async function track(req, res) {
  const { path, referrer } = req.body || {};
  const userAgent = req.get("user-agent") || "";
  const ip = req.ip || req.connection?.remoteAddress || "";

  if (!path || typeof path !== "string") {
    return res.status(400).json({ message: "Path is required." });
  }

  const deviceType = detectDevice(userAgent);

  try {
    await pool.query(
      `INSERT INTO analytics_visits (path, referrer, user_agent, ip, device_type)
       VALUES ($1, $2, $3, $4, $5)`,
      [path, referrer || null, userAgent, ip, deviceType]
    );
    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Track analytics error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function summary(req, res) {
  try {
    const [totalViews, uniqueVisitors, byDevice, recent] = await Promise.all([
      pool.query("SELECT COUNT(*) AS total FROM analytics_visits"),
      pool.query("SELECT COUNT(DISTINCT ip) AS total FROM analytics_visits"),
      pool.query(
        `SELECT device_type, COUNT(*)::int AS total
         FROM analytics_visits
         GROUP BY device_type`
      ),
      pool.query(
        `SELECT id, path, device_type, ip, user_agent, referrer, created_at
         FROM analytics_visits
         ORDER BY created_at DESC
         LIMIT 50`
      ),
    ]);

    const byDeviceMap = byDevice.rows.reduce((acc, row) => {
      acc[row.device_type] = row.total;
      return acc;
    }, {});

    return res.status(200).json({
      totalViews: Number(totalViews.rows[0].total),
      uniqueVisitors: Number(uniqueVisitors.rows[0].total),
      byDevice: byDeviceMap,
      recent: recent.rows,
    });
  } catch (error) {
    console.error("Analytics summary error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = { track, summary };
