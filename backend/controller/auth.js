const { ErrorHandler } = require('../errors/error.js');
const User = require('../models/userModel.js');
const dotenv = require('dotenv')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
dotenv.config({path: './config/config.env'});

const createdUser = async (req, res, next) => {
  const { fullname, email, passwordHash } = req.body;

  if (!fullname || !email || !passwordHash) {
    return next(new ErrorHandler("Please fill the required information!", 400));
  }

  try {
    const existingUser = await User.findOne({ email });


    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered, Try Login!!"
      });

    }

    const hashedPassword = await bcrypt.hash(passwordHash, 10);

    const newUser = await User.create({
      fullname,
      email,
      passwordHash: hashedPassword
    });

    const token = jwt.sign(
      { _id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    )

    res.cookie("token", token, {
      httpOnly: true,
    })
    res.status(201).json({
      success: true,
      user: newUser
    });

    res.redirect('/home')
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, passwordHash } = req.body;

    if (!email || !passwordHash) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      user
    });
    
    res.redirect('/home')

  } catch (err) {
    next(err);
  }
};


module.exports = { createdUser, loginUser};
