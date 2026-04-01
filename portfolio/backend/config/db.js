const { Pool } = require("pg");

const useSsl = String(process.env.PG_SSL || "false").toLowerCase() === "true";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Unexpected DB error:", err);
});

module.exports = pool;
