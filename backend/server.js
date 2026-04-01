require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const skillRoutes = require("./routes/skills");
const cvRoutes = require("./routes/cv");
const contactRoutes = require("./routes/contacts");
const profileRoutes = require("./routes/profile");
const statsRoutes = require("./routes/stats");
const analyticsRoutes = require("./routes/analytics");

const app = express();
app.set("trust proxy", 1);

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.length) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Portfolio API running." });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Error handler (multer, etc.)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (err.message && err.message.includes("Only")) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: "Server error." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
