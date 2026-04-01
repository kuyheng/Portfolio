require("dotenv").config();
const pool = require("../config/db");

const statements = [
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
  )`,
  `CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    tech_stack TEXT[],
    thumbnail_url TEXT,
    github_url TEXT,
    live_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    icon_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS cv (
    id SERIAL PRIMARY KEY,
    file_url TEXT NOT NULL,
    file_name TEXT,
    download_count INTEGER DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS page_views (
    id SERIAL PRIMARY KEY,
    path TEXT,
    referrer TEXT,
    user_agent TEXT,
    device_type VARCHAR(20),
    ip TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category)`,
  `CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects (sort_order)`,
  `CREATE INDEX IF NOT EXISTS idx_skills_category ON skills (category)`,
  `CREATE INDEX IF NOT EXISTS idx_contacts_is_read ON contacts (is_read)`,
  `CREATE INDEX IF NOT EXISTS idx_page_views_device ON page_views (device_type)`,
  `CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views (created_at)`,
];

async function run() {
  for (const sql of statements) {
    await pool.query(sql);
  }
  console.log("Database tables are ready.");
  await pool.end();
}

run().catch((error) => {
  console.error("DB init failed:", error);
  pool.end().finally(() => process.exit(1));
});
