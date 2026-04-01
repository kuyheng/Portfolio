const express = require("express");
const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");
const { getStats } = require("../controllers/statsController");

const router = express.Router();

router.get("/", auth, requireAdmin, getStats);

module.exports = router;
