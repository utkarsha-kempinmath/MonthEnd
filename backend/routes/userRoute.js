const express = require("express");
const { createdUser } = require("../controller/user");

const router = express.Router();

router.post("/register", createdUser);

module.exports = router;
