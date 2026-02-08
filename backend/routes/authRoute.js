const express = require("express");
const { createdUser } = require("../controller/auth");

const router = express.Router();

router.post("/signup", createdUser);

module.exports = router;
