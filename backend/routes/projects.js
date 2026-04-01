const express = require("express");
const { body, param } = require("express-validator");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { uploadImage } = require("../middleware/upload");
const {
  getAll,
  getOne,
  create,
  update,
  remove,
  reorder,
} = require("../controllers/projectController");

const router = express.Router();

router.get("/", getAll);
router.get("/:id", [param("id").isInt().withMessage("Project id must be an integer.")], validate, getOne);

router.post(
  "/",
  auth,
  uploadImage.single("thumbnail"),
  [
    body("title").notEmpty().withMessage("Title is required."),
    body("category").optional().isLength({ max: 50 }),
    body("github_url").optional().isURL().withMessage("GitHub URL must be valid."),
    body("live_url").optional().isURL().withMessage("Live URL must be valid."),
  ],
  validate,
  create
);

router.put(
  "/:id",
  auth,
  uploadImage.single("thumbnail"),
  [
    param("id").isInt().withMessage("Project id must be an integer."),
    body("github_url").optional().isURL().withMessage("GitHub URL must be valid."),
    body("live_url").optional().isURL().withMessage("Live URL must be valid."),
  ],
  validate,
  update
);

router.delete(
  "/:id",
  auth,
  [param("id").isInt().withMessage("Project id must be an integer.")],
  validate,
  remove
);

router.patch(
  "/reorder",
  auth,
  [
    body("order").optional().isArray(),
    body("ids").optional().isArray(),
    body().custom((value) => {
      if (!value.order && !value.ids) {
        throw new Error("Either order or ids is required.");
      }
      return true;
    }),
  ],
  validate,
  reorder
);

module.exports = router;
