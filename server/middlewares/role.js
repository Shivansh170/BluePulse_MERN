const requiredRole = (role) => {
  return function (req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      if (req.user.role !== role) {
        return res.status(403).json({
          success: false,
          error: `Access denied. Only ${role}s can perform this action.`,
        });
      }

      next();
    } catch (err) {
      console.error("Role middleware error:", err);
      return res.status(500).json({
        success: false,
        error: "Server error while checking permissions",
      });
    }
  };
};

module.exports = requiredRole;
