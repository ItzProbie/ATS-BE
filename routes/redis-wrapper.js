const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/Auth");
const { s3UploadLimit } = require("../controllers/Redis-Wrapper");

router.get("/s3-upload-limit" , auth , s3UploadLimit);

module.exports = router;