const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 80,
  },
  password: {
    type: String,
    required: true,
    maxlength: 80,
  },
  role: {
    type: String,
    required: true,
    maxlength: 80,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
