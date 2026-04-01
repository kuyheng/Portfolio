const express = require("express");
const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");
const { track, summary } = require("../controllers/analyticsController");

const router = express.Router();

router.post("/track", track);
router.get("/summary", auth, requireAdmin, summary);

module.exports = router;
