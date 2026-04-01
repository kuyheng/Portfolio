const path = require("path");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const pool = require("../config/db");

async function run() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";
  const jobTitle = process.env.ADMIN_JOB_TITLE || "Admin";
  const resetPassword = String(process.env.ADMIN_RESET_PASSWORD || "").toLowerCase() === "true";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  }

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

  if (existing.rows.length) {
    if (resetPassword) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        `UPDATE users
         SET name = $1,
             job_title = $2,
             password_hash = $3,
             role = 'admin',
             updated_at = NOW()
         WHERE email = $4`,
        [name, jobTitle, hash, email]
      );
      console.log("Admin user updated (password reset).");
    } else {
      await pool.query(
        `UPDATE users
         SET name = $1,
             job_title = $2,
             role = 'admin',
             updated_at = NOW()
         WHERE email = $3`,
        [name, jobTitle, email]
      );
      console.log("Admin user updated (password unchanged).");
    }
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO users (name, email, password_hash, job_title, role)
     VALUES ($1, $2, $3, $4, 'admin')`,
    [name, email, hash, jobTitle]
  );

  console.log("Admin user created.");
}

run()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
