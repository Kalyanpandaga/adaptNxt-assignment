const Product = require("../models/Product");
const errorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", category = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const query = {};
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      products: products.map((p) => ({
        id: p._id,
        title: p.title,
        brand: p.brand,
        price: p.price,
        imageUrl: p.image_url,
        rating: p.rating?.rate || 0,
        category: p.category,
        availability: p.availability,
      })),
      total,
    });
  } catch (err) {
    return errorResponse(res, 500, "PRODUCT_LIST_ERROR", err.message);
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "INVALID_ID", "Invalid product ID");
    }
    const p = await Product.findById(id);
    if (!p) return errorResponse(res, 404, "NOT_FOUND", "Product not found");
    res.json({
      id: p._id,
      title: p.title,
      brand: p.brand,
      price: p.price,
      imageUrl: p.image_url,
      rating: p.rating?.rate || 0,
      category: p.category,
      availability: p.availability,
      description: p.description,
    });
  } catch (err) {
    return errorResponse(res, 500, "PRODUCT_FETCH_ERROR", err.message);
  }
};

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      brand,
      imageUrl,
      description,
      rating,
      category,
      availability,
    } = req.body;
    const product = new Product({
      title,
      price,
      brand,
      image_url: imageUrl,
      description,
      rating: { rate: rating || 0, count: 0 },
      category,
      availability,
    });
    await product.save();
    res.status(201).json({
      id: product._id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      imageUrl: product.image_url,
      rating: product.rating?.rate || 0,
      category: product.category,
      availability: product.availability,
    });
  } catch (err) {
    return errorResponse(res, 400, "PRODUCT_CREATE_ERROR", err.message);
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "INVALID_ID", "Invalid product ID");
    }
    const {
      title,
      price,
      brand,
      imageUrl,
      description,
      rating,
      category,
      availability,
    } = req.body;
    const product = await Product.findById(id);
    if (!product)
      return errorResponse(res, 404, "NOT_FOUND", "Product not found");
    product.title = title;
    product.price = price;
    product.brand = brand;
    product.image_url = imageUrl;
    product.description = description;
    product.rating = { rate: rating || 0, count: product.rating?.count || 0 };
    product.category = category;
    product.availability = availability;
    await product.save();
    res.json({
      id: product._id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      imageUrl: product.image_url,
      rating: product.rating?.rate || 0,
      category: product.category,
      availability: product.availability,
    });
  } catch (err) {
    return errorResponse(res, 400, "PRODUCT_UPDATE_ERROR", err.message);
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "INVALID_ID", "Invalid product ID");
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product)
      return errorResponse(res, 404, "NOT_FOUND", "Product not found");
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    return errorResponse(res, 400, "PRODUCT_DELETE_ERROR", err.message);
  }
};
