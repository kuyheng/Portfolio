const express = require("express");
const { body, param } = require("express-validator");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { create, getAll, markRead, remove } = require("../controllers/contactController");

const router = express.Router();

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("message").notEmpty().withMessage("Message is required."),
  ],
  validate,
  create
);

router.get("/", auth, getAll);

router.patch(
  "/:id/read",
  auth,
  [param("id").isInt().withMessage("Contact id must be an integer.")],
  validate,
  markRead
);

router.delete(
  "/:id",
  auth,
  [param("id").isInt().withMessage("Contact id must be an integer.")],
  validate,
  remove
);

module.exports = router;
