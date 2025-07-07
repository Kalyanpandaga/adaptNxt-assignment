const express = require("express");
const {
  signup,
  login,
  getCurrentUser,
} = require("../controllers/authController");
const validateRequest = require("../middleware/validateMiddleware");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const {
  validateSignupData,
  validateLoginData,
} = require("../utils/validations/validateUserData");

const authRouter = express.Router();

authRouter.post("/signup", validateRequest(validateSignupData), signup);
authRouter.post("/login", validateRequest(validateLoginData), login);
authRouter.get("/me", isAuthenticated, getCurrentUser);

module.exports = authRouter;
