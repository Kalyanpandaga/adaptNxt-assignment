const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const errorResponse = require("../utils/errorResponse");

// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return errorResponse(res, 400, "CART_EMPTY", "Cart is empty");
    }
    const items = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));
    let totalAmount = 0;
    cart.items.forEach((item) => {
      totalAmount += item.productId.price * item.quantity;
    });
    const order = new Order({
      userId,
      items,
      totalAmount,
    });
    await order.save();
    // Clear cart
    cart.items = [];
    await cart.save();
    // Build response
    const orderItems = await Promise.all(
      order.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          title: product.title,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );
    res.status(201).json({
      order: {
        id: order._id,
        items: orderItems,
        totalAmount: order.totalAmount,
        status: "PLACED",
      },
    });
  } catch (err) {
    return errorResponse(res, 400, "ORDER_CREATE_ERROR", err.message);
  }
};

// GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === "ADMIN") {
      orders = await Order.find({}).populate("items.productId userId");
    } else {
      orders = await Order.find({ userId: req.user._id }).populate(
        "items.productId"
      );
    }
    const result = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await Promise.all(
          order.items.map(async (item) => {
            const product = await Product.findById(item.productId);
            return {
              title: product.title,
              quantity: item.quantity,
              price: product.price,
            };
          })
        );
        return {
          id: order._id,
          items: orderItems,
          totalAmount: order.totalAmount,
          status: "PLACED",
        };
      })
    );
    res.json({ orders: result });
  } catch (err) {
    return errorResponse(res, 400, "ORDER_FETCH_ERROR", err.message);
  }
};
