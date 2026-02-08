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
        message: "User already registered"
      });

    }

    const hashedPassword = await bcrypt.hash(passwordHash, 10);

    const newUser = await User.create({
      fullname,
      email,
      passwordHash: hashedPassword
    });

    const token = jwt.sign(
      { userId: newUser._id },
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

  } catch (err) {
    next(err);
  }
};

module.exports = { createdUser };
