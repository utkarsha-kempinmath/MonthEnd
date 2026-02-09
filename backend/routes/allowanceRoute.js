const express = require("express");
const {
  getAllowances,
  addAllowance,
  updateAllowance,
  deleteAllowance
} = require("../controller/allowance");

const  isLoggedIn  = require("../middleware/auth");

const router = express.Router();

router.use(isLoggedIn); 

router.get("/", getAllowances);
router.post("/", addAllowance);
router.put("/:id", updateAllowance);
router.delete("/:id", deleteAllowance);

module.exports = router;
