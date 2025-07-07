const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const validateRequest = require("../middleware/validateMiddleware");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
const {
  validateProductData,
} = require("../utils/validations/validateProductData");

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);
productRouter.post(
  "/",
  isAuthenticated,
  isAdmin,
  validateRequest(validateProductData),
  createProduct
);
productRouter.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  validateRequest(validateProductData),
  updateProduct
);
productRouter.delete("/:id", isAuthenticated, isAdmin, deleteProduct);

module.exports = productRouter;
