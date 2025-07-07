const express = require("express");
const { createOrder, getOrders } = require("../controllers/orderController");
const { isAuthenticated } = require("../middleware/isAuthenticated");

const orderRouter = express.Router();

orderRouter.post("/", isAuthenticated, createOrder);
orderRouter.get("/", isAuthenticated, getOrders);

module.exports = orderRouter;
