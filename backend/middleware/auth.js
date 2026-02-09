const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)


    const user = await User.findById(decoded._id)
    console.log(user)

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user 

    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" })
  }
}
module.exports = isLoggedIn
