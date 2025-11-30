const jwt = require("jsonwebtoken");

const isVerified = (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    if (!header) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing from Authorization header",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = isVerified;
