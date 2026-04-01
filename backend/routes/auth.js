const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { register, login, me } = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
    body("name").optional().isLength({ max: 100 }),
    body("job_title").optional().isLength({ max: 100 }),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  validate,
  login
);

router.get("/me", auth, me);

module.exports = router;
