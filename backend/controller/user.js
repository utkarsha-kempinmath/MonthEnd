const {ErrorHandler} = require('../errors/error');
const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');

const createdUser = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new ErrorHandler("Please fill the required information!", 400));
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ErrorHandler("User already registered", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      user: newUser
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { createdUser };
