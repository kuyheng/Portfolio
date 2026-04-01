const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");
const validate = require("../middleware/validate");
const { uploadImage } = require("../middleware/upload");
const { getProfile, updateProfile } = require("../controllers/profileController");

const router = express.Router();

router.get("/", getProfile);

router.put(
  "/",
  auth,
  requireAdmin,
  uploadImage.single("photo"),
  [
    body("email").optional().isEmail().withMessage("Valid email is required."),
    body("name").optional().isLength({ max: 100 }),
    body("job_title").optional().isLength({ max: 100 }),
  ],
  validate,
  updateProfile
);

module.exports = router;
