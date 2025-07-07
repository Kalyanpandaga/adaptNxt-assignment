const Cart = require("../models/Cart");
const Product = require("../models/Product");
const errorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.json({ cart: [] });
    }
    const cartItems = cart.items.map((item) => ({
      product: {
        title: item.productId.title,
        price: item.productId.price,
      },
      quantity: item.quantity,
    }));
    res.json({ cart: cartItems });
  } catch (err) {
    return errorResponse(res, 500, "CART_FETCH_ERROR", err.message);
  }
};

// POST /api/cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse(
        res,
        400,
        "INVALID_PRODUCT_ID",
        "Invalid product ID"
      );
    }
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 404, "PRODUCT_NOT_FOUND", "Product not found");
    }
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    return res.status(200).json({ message: "Cart updated successfully" });
  } catch (err) {
    return errorResponse(res, 400, "CART_UPDATE_ERROR", err.message);
  }
};

// DELETE /api/cart/:productId
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse(
        res,
        400,
        "INVALID_PRODUCT_ID",
        "Invalid product ID"
      );
    }
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return errorResponse(res, 404, "CART_NOT_FOUND", "Cart not found");
    }
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();
    return res.json({ message: "Product removed from cart" });
  } catch (err) {
    return errorResponse(res, 400, "CART_REMOVE_ERROR", err.message);
  }
};
