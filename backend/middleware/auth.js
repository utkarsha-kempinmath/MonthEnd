const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);

    req.user = data;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports =  isLoggedIn ;
