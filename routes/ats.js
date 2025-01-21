const express = require("express");
const router = express.Router();

const { auth , upload } = require("../middlewares/Auth");
const { findATS } = require("../controllers/Ats");
const { s3UploadLimitMid, isUserBlockedMid } = require("../controllers/Redis-Wrapper");

// router.get("/generate-ats" , auth , findATS);
router.post("/generate-ats" ,
     auth ,
    isUserBlockedMid ,
    s3UploadLimitMid ,
    upload.single("file") ,
    findATS
)

module.exports = router;


