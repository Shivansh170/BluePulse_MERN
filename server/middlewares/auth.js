const jwt = require("jsonwebtoken");

const isVerified = (req, res, next) => {
  const token = req.headers["Authorization"].split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied....",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Token expired...",
    });
  }
};

module.exports = isVerified;
