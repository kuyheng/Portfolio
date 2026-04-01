const { Pool } = require("pg");

const sslEnabled = String(process.env.PG_SSL || "").toLowerCase() === "true";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Unexpected PG client error:", err);
});

module.exports = pool;
