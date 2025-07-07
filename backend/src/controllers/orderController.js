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
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let query = {};
    if (req.user.role !== "ADMIN") {
      query.userId = req.user._id;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "items.productId",
        select: "title price",
      })
      .populate({
        path: "userId",
        select: "firstName lastName emailId",
      });

    const result = orders.map((order) => {
      const orderItems = order.items.map((item) => {
        // item.productId may be null if product was deleted
        return {
          title: item.productId ? item.productId.title : "[Deleted Product]",
          quantity: item.quantity,
          price: item.productId ? item.productId.price : 0,
        };
      });
      const orderObj = {
        id: order._id,
        items: orderItems,
        totalAmount: order.totalAmount,
        status: "PLACED",
      };
      if (req.user.role === "ADMIN" && order.userId) {
        orderObj.user = {
          user_id: order.userId._id,
          firstName: order.userId.firstName,
          lastName: order.userId.lastName,
        };
      }
      return orderObj;
    });
    res.json({ orders: result, total });
  } catch (err) {
    return errorResponse(res, 500, "ORDER_FETCH_ERROR", err.message);
  }
};
