const express = require("express");
const router = express.Router();

const { upload, download } = require("../controllers/Media");
const { auth } = require("../middlewares/Auth");

router.get("/upload" , auth , upload);
router.get("/download" , auth , download);

module.exports = router;