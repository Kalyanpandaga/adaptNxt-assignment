const jwt = require("jsonwebtoken");
const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");
const { JWT_PRIVATE_KEY } = require("../config/constants");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new Error("Authentication token missing");

    const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) throw new Error("User not found");

    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, 401, "AUTH_ERROR", err.message);
  }
};

module.exports = { isAuthenticated };
