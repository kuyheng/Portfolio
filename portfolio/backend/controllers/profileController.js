const pool = require("../config/db");

async function getProfile(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, name, email, job_title, bio, profile_photo_url,
              github_url, linkedin_url, twitter_url, created_at, updated_at
       FROM users
       ORDER BY id ASC
       LIMIT 1`
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: "Profile not found." });
    }
    return res.status(200).json({ profile: result.rows[0] });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function updateProfile(req, res) {
  const { name, email, job_title, bio, github_url, linkedin_url, twitter_url } = req.body;
  const profile_photo_url = req.file ? `/uploads/${req.file.filename}` : req.body.profile_photo_url;

  try {
    const existing = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
    if (!existing.rows.length) {
      return res.status(404).json({ message: "User not found." });
    }
    const current = existing.rows[0];

    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           email = $2,
           job_title = $3,
           bio = $4,
           profile_photo_url = $5,
           github_url = $6,
           linkedin_url = $7,
           twitter_url = $8
       WHERE id = $9
       RETURNING id, name, email, job_title, bio, profile_photo_url,
                 github_url, linkedin_url, twitter_url, created_at, updated_at`,
      [
        name ?? current.name,
        email ?? current.email,
        job_title ?? current.job_title,
        bio ?? current.bio,
        profile_photo_url ?? current.profile_photo_url,
        github_url ?? current.github_url,
        linkedin_url ?? current.linkedin_url,
        twitter_url ?? current.twitter_url,
        req.user.id,
      ]
    );
    return res.status(200).json({ profile: result.rows[0] });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = { getProfile, updateProfile };
