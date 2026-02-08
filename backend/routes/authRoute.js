const express = require("express");
const { createdUser, loginUser } = require("../controller/auth");

const router = express.Router();

router.post("/signup", createdUser);
router.post("/login", loginUser);


module.exports = router;
