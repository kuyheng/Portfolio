const pool = require("../config/db");

function getDeviceType(userAgent = "") {
  const ua = userAgent.toLowerCase();
  if (/bot|crawler|spider|crawling/.test(ua)) return "bot";
  if (/tablet|ipad|playbook|silk/.test(ua)) return "tablet";
  if (/android/.test(ua) && !/mobile/.test(ua)) return "tablet";
  if (/mobi|android|iphone|ipod/.test(ua)) return "mobile";
  return "desktop";
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (Array.isArray(forwarded)) {
    return forwarded[0];
  }
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.ip;
}

async function track(req, res) {
  const { path, referrer } = req.body || {};
  const userAgent = req.headers["user-agent"] || "";
  const deviceType = getDeviceType(userAgent);
  const ip = getClientIp(req);

  try {
    await pool.query(
      `INSERT INTO page_views (path, referrer, user_agent, device_type, ip)
       VALUES ($1, $2, $3, $4, $5)`,
      [path || "/", referrer || null, userAgent, deviceType, ip]
    );
    return res.status(201).json({ message: "Tracked" });
  } catch (error) {
    console.error("Track analytics error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function summary(req, res) {
  try {
    const [totalViews, uniqueVisitors, byDevice, recent] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM page_views"),
      pool.query("SELECT COUNT(DISTINCT ip) FROM page_views"),
      pool.query("SELECT device_type, COUNT(*) FROM page_views GROUP BY device_type"),
      pool.query(
        `SELECT id, path, device_type, ip, user_agent, referrer, created_at
         FROM page_views
         ORDER BY created_at DESC
         LIMIT 20`
      ),
    ]);

    const deviceMap = byDevice.rows.reduce((acc, row) => {
      acc[row.device_type] = Number(row.count);
      return acc;
    }, {});

    return res.status(200).json({
      totalViews: Number(totalViews.rows[0].count),
      uniqueVisitors: Number(uniqueVisitors.rows[0].count),
      byDevice: deviceMap,
      recent: recent.rows,
    });
  } catch (error) {
    console.error("Analytics summary error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = { track, summary };
