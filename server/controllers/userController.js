const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const { name, password, role } = req.body;
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(500).json({
        success: false,
        message: "A user with this name already exists...",
      });
    }
    const hashedpassword = await bcryptjs.hash(password, 16);
    const newUser = new User({ name, password: hashedpassword, role });
    await newUser.save();
    res.status(400).json({
      success: true,
      message: `${name} added as a ${role}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "No such user found...",
      });
    }
    isVerified = await bcryptjs.compare(password, user.password);
    if (!isVerified) {
      return res.status(401).json({
        success: "false",
        message: "Invalid username or password...",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      success: "true",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: "false",
      message: error.message,
    });
  }
};
module.exports = { registerUser, userLogin };
