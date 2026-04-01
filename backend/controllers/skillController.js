const pool = require("../config/db");

function groupSkills(skills) {
  return skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});
}

async function getAll(req, res) {
  try {
    const result = await pool.query("SELECT * FROM skills ORDER BY sort_order ASC, created_at DESC");
    return res.status(200).json({ skills: groupSkills(result.rows) });
  } catch (error) {
    console.error("Get skills error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function create(req, res) {
  const { name, category, icon_url, sort_order } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO skills (name, category, icon_url, sort_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, category || null, icon_url || null, sort_order ? Number(sort_order) : 0]
    );
    return res.status(201).json({ skill: result.rows[0] });
  } catch (error) {
    console.error("Create skill error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function update(req, res) {
  const { id } = req.params;
  const { name, category, icon_url, sort_order } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM skills WHERE id = $1", [id]);
    if (!existing.rows.length) {
      return res.status(404).json({ message: "Skill not found." });
    }
    const current = existing.rows[0];
    const result = await pool.query(
      `UPDATE skills
       SET name = $1,
           category = $2,
           icon_url = $3,
           sort_order = $4
       WHERE id = $5
       RETURNING *`,
      [
        name ?? current.name,
        category ?? current.category,
        icon_url ?? current.icon_url,
        typeof sort_order !== "undefined" ? Number(sort_order) : current.sort_order,
        id,
      ]
    );
    return res.status(200).json({ skill: result.rows[0] });
  } catch (error) {
    console.error("Update skill error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function remove(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM skills WHERE id = $1 RETURNING id", [id]);
    if (!result.rows.length) {
      return res.status(404).json({ message: "Skill not found." });
    }
    return res.status(200).json({ message: "Skill deleted." });
  } catch (error) {
    console.error("Delete skill error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = { getAll, create, update, remove };
