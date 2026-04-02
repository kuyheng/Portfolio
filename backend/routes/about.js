const express = require("express");
const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");
const { uploadImage } = require("../middleware/upload");
const { getAbout, updateAbout } = require("../controllers/aboutController");

const router = express.Router();

router.get("/", getAbout);
router.put("/", auth, requireAdmin, uploadImage.single("avatar"), updateAbout);

module.exports = router;
