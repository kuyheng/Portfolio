const express = require("express");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { uploadPdf } = require("../middleware/upload");
const { getCurrent, download, upload } = require("../controllers/cvController");

const router = express.Router();

router.get("/", getCurrent);
router.get("/download", download);

router.post("/upload", auth, uploadPdf.single("file"), validate, upload);

module.exports = router;
