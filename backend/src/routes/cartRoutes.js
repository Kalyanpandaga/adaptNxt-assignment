const express = require("express");
const {
  getCart,
  addToCart,
  removeFromCart,
} = require("../controllers/cartController");
const validateRequest = require("../middleware/validateMiddleware");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { validateCartData } = require("../utils/validations/validateCartData");

const cartRouter = express.Router();

cartRouter.get("/", isAuthenticated, getCart);
cartRouter.post(
  "/",
  isAuthenticated,
  validateRequest(validateCartData),
  addToCart
);
cartRouter.delete("/:productId", isAuthenticated, removeFromCart);

module.exports = cartRouter;
