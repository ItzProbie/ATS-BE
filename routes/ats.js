const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/Auth");
const { findATS } = require("../controllers/Ats");

router.get("/generate-ats" , auth , findATS);

module.exports = router;
