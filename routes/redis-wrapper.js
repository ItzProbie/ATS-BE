const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/Auth");
const { isResultReady } = require("../controllers/Redis-Wrapper");

router.get("/result" , auth , isResultReady);

module.exports = router;