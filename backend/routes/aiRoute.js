const express = require("express");
const { analyzeText } = require("../controller/ai");

const router = express.Router();

router.post("/analyze", analyzeText);

module.exports = router;
