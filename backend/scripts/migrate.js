const fs = require("fs/promises");
const path = require("path");
const pool = require("../config/db");

async function run() {
  const migrationsDir = path.join(__dirname, "..", "migrations");
  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (!files.length) {
    console.log("No migrations found.");
    return;
  }

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = await fs.readFile(filePath, "utf8");
    console.log(`Running migration ${file}...`);
    await pool.query(sql);
  }

  console.log("Migrations completed.");
}

run()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
