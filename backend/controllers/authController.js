const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

function sanitizeUser(user) {
  if (!user) return null;
  const { password_hash, ...safe } = user;
  return safe;
}

async function register(req, res) {
  const { name, email, password, job_title } = req.body;

  try {
    const allowRegistration =
      String(process.env.ALLOW_REGISTRATION || "").toLowerCase() === "true";
    if (!allowRegistration) {
      return res.status(403).json({ message: "Registration is disabled." });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, job_title, role)
       VALUES ($1, $2, $3, $4, 'user')
       RETURNING *`,
      [name, email, hash, job_title || null]
    );

    const user = sanitizeUser(result.rows[0]);
    return res.status(201).json({ user });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role || "user" },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

async function me(req, res) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
    const user = sanitizeUser(result.rows[0]);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Me error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = { register, login, me };
