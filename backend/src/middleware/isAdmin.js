const errorResponse = require("../utils/errorResponse");

const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return errorResponse(res, 403, "FORBIDDEN", "Access denied: Admins only");
  }
  next();
};

module.exports = isAdmin;
