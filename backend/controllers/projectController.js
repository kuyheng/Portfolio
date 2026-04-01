const pool = require("../config/db");

function parseTechStack(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (typeof input === "string") {
    return input
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

async function getAll(req, res) {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC");
    return res.status(200).json({ projects: result.rows });
  } catch (error) {
    console.error("Get projects error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function getOne(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
    if (!result.rows.length) {
      return res.status(404).json({ message: "Project not found." });
    }
    return res.status(200).json({ project: result.rows[0] });
  } catch (error) {
    console.error("Get project error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function create(req, res) {
  const { title, description, category, tech_stack, github_url, live_url, sort_order } = req.body;
  const thumbnail_url = req.file ? `/uploads/${req.file.filename}` : req.body.thumbnail_url || null;
  const techStack = parseTechStack(tech_stack);

  try {
    const result = await pool.query(
      `INSERT INTO projects
       (title, description, category, tech_stack, thumbnail_url, github_url, live_url, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        title,
        description || null,
        category || null,
        techStack,
        thumbnail_url,
        github_url || null,
        live_url || null,
        sort_order ? Number(sort_order) : 0,
      ]
    );
    return res.status(201).json({ project: result.rows[0] });
  } catch (error) {
    console.error("Create project error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function update(req, res) {
  const { id } = req.params;
  const { title, description, category, tech_stack, github_url, live_url, sort_order } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
    if (!existing.rows.length) {
      return res.status(404).json({ message: "Project not found." });
    }
    const current = existing.rows[0];
    const thumbnail_url = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.thumbnail_url || current.thumbnail_url;
    const techStack = tech_stack ? parseTechStack(tech_stack) : current.tech_stack || [];

    const result = await pool.query(
      `UPDATE projects
       SET title = $1,
           description = $2,
           category = $3,
           tech_stack = $4,
           thumbnail_url = $5,
           github_url = $6,
           live_url = $7,
           sort_order = $8
       WHERE id = $9
       RETURNING *`,
      [
        title ?? current.title,
        description ?? current.description,
        category ?? current.category,
        techStack,
        thumbnail_url,
        github_url ?? current.github_url,
        live_url ?? current.live_url,
        typeof sort_order !== "undefined" ? Number(sort_order) : current.sort_order,
        id,
      ]
    );
    return res.status(200).json({ project: result.rows[0] });
  } catch (error) {
    console.error("Update project error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function remove(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM projects WHERE id = $1 RETURNING id", [id]);
    if (!result.rows.length) {
      return res.status(404).json({ message: "Project not found." });
    }
    return res.status(200).json({ message: "Project deleted." });
  } catch (error) {
    console.error("Delete project error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function reorder(req, res) {
  const { order, ids } = req.body;
  let updates = [];

  if (Array.isArray(order)) {
    updates = order.map((item) => ({ id: item.id, sort_order: item.sort_order }));
  } else if (Array.isArray(ids)) {
    updates = ids.map((id, index) => ({ id, sort_order: index + 1 }));
  }

  if (!updates.length) {
    return res.status(400).json({ message: "Invalid reorder payload." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const item of updates) {
      await client.query("UPDATE projects SET sort_order = $1 WHERE id = $2", [
        item.sort_order,
        item.id,
      ]);
    }
    await client.query("COMMIT");
    return res.status(200).json({ message: "Project order updated." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Reorder projects error:", error);
    return res.status(500).json({ message: "Server error." });
  } finally {
    client.release();
  }
}

module.exports = { getAll, getOne, create, update, remove, reorder };
