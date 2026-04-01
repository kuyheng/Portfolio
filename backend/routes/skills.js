const express = require("express");
const { body, param } = require("express-validator");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { getAll, create, update, remove } = require("../controllers/skillController");

const router = express.Router();

router.get("/", getAll);

router.post(
  "/",
  auth,
  [
    body("name").notEmpty().withMessage("Skill name is required."),
    body("category").optional().isLength({ max: 50 }),
    body("icon_url").optional().isLength({ max: 255 }),
  ],
  validate,
  create
);

router.put(
  "/:id",
  auth,
  [
    param("id").isInt().withMessage("Skill id must be an integer."),
    body("name").optional().isLength({ max: 100 }),
    body("category").optional().isLength({ max: 50 }),
    body("icon_url").optional().isLength({ max: 255 }),
  ],
  validate,
  update
);

router.delete(
  "/:id",
  auth,
  [param("id").isInt().withMessage("Skill id must be an integer.")],
  validate,
  remove
);

module.exports = router;
