const express = require("express");
const { getDashboard } = require("../controller/home");
const isLoggedIn = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", isLoggedIn, getDashboard);

module.exports = router;
