const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, sub } = payload; // sub = googleId

    let user = await User.findOne({ email });

    if (user && user.authProvider === "local") {
      user.authProvider = "google";
      user.googleId = sub;
      await user.save();
    }

    if (!user) {
      user = await User.create({
        fullname: name,
        email,
        passwordHash: null,
        authProvider: "google",
        googleId: sub,
      });
    }

    const jwtToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    return res.status(200).json({
      success: true,
      token: jwtToken,
      user,
    });

  } catch (err) {
    console.log("Google Auth Error:", err);

    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

module.exports = { googleLogin };