const mongoose = require("mongoose");
const validator = require("validator");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 200,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 100,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      validate(value) {
        if (value <= 0) {
          throw new Error("Price must be greater than zero");
        }
      },
    },
    description: {
      type: String,
      maxLength: 1000,
    },
    category: {
      type: String,
      maxLength: 100,
      trim: true,
    },
    image_url: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid image URL");
        }
      },
    },
    rating: {
      rate: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    availability: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
