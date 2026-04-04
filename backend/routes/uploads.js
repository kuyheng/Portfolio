const express = require("express");
const { param } = require("express-validator");
const validate = require("../middleware/validate");
const { getFile } = require("../controllers/uploadController");

const router = express.Router();

router.get(
  "/:id",
  [param("id").isInt({ min: 1 }).withMessage("Upload id must be a positive integer.")],
  validate,
  getFile
);

module.exports = router;
