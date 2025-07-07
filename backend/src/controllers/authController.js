const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");

const signup = async (req, res) => {
  try {
    const userData = req.body;

    const existingUser = await User.findOne({ emailId: userData.emailId });
    if (existingUser) {
      return errorResponse(res, 400, "USER_EXISTS", "Email already registered");
    }

    const user = new User(userData);
    await user.save();
    const token = await user.getJwt();

    res.status(201).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    return errorResponse(res, 400, "SIGNUP_ERROR", err.message);
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user)
      return errorResponse(res, 401, "LOGIN_ERROR", "Invalid credintials");

    const isValid = await user.validatePassword(password);
    if (!isValid)
      return errorResponse(res, 401, "LOGIN_ERROR", "Invalid credintials");

    const token = await user.getJwt();
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    return errorResponse(res, 400, "LOGIN_FAILED", err.message);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      role: user.role,
    });
  } catch (err) {
    return errorResponse(res, 500, "FETCH_USER_ERROR", err.message);
  }
};

module.exports = {
  signup,
  login,
  getCurrentUser,
};
