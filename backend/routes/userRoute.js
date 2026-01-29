const express = require("express");
const { createdUser } = require("../controller/user");

const router = express.Router();

router.post("/signup", createdUser);

module.exports = router;
