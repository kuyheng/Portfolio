const pool = require("../config/db");

async function create(req, res) {
  const { name, email, message } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO contacts (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, message]
    );
    return res.status(201).json({ contact: result.rows[0] });
  } catch (error) {
    console.error("Create contact error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function getAll(req, res) {
  try {
    const result = await pool.query("SELECT * FROM contacts ORDER BY created_at DESC");
    return res.status(200).json({ contacts: result.rows });
  } catch (error) {
    console.error("Get contacts error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function markRead(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE contacts SET is_read = TRUE WHERE id = $1 RETURNING *`,
      [id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: "Contact not found." });
    }
    return res.status(200).json({ contact: result.rows[0] });
  } catch (error) {
    console.error("Mark read error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function remove(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM contacts WHERE id = $1 RETURNING id", [id]);
    if (!result.rows.length) {
      return res.status(404).json({ message: "Contact not found." });
    }
    return res.status(200).json({ message: "Contact deleted." });
  } catch (error) {
    console.error("Delete contact error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = { create, getAll, markRead, remove };
