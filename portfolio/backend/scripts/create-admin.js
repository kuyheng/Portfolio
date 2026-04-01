require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const [email, password, name, jobTitle] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.js <email> <password> [name] [jobTitle]");
  process.exit(1);
}

async function run() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      job_title VARCHAR(100),
      bio TEXT,
      profile_photo_url TEXT,
      github_url TEXT,
      linkedin_url TEXT,
      twitter_url TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`
  );

  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, job_title)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email)
     DO UPDATE SET
       name = EXCLUDED.name,
       password_hash = EXCLUDED.password_hash,
       job_title = EXCLUDED.job_title,
       updated_at = NOW()
     RETURNING id, email, name, job_title`,
    [name || null, email, hash, jobTitle || null]
  );

  console.log("Admin user ready:", result.rows[0]);
  await pool.end();
}

run().catch((error) => {
  console.error("Failed to create admin:", error);
  pool.end().finally(() => process.exit(1));
});
