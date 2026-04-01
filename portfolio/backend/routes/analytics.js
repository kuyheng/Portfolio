const express = require("express");
const auth = require("../middleware/auth");
const { track, summary } = require("../controllers/analyticsController");

const router = express.Router();

router.post("/track", track);
router.get("/summary", auth, summary);

module.exports = router;
