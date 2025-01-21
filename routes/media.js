const express = require("express");
const router = express.Router();

const { upload, download } = require("../controllers/Media");
const { auth } = require("../middlewares/Auth");
const { s3UploadLimitMid } = require("../controllers/Redis-Wrapper");

router.get("/upload" , s3UploadLimitMid , auth , upload);
router.get("/download" , auth , download);

module.exports = router;