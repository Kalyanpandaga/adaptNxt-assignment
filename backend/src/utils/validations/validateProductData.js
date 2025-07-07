const validator = require("validator");

const validateProductData = (data) => {
  const {
    title,
    price,
    brand,
    imageUrl,
    description,
    rating,
    category,
    availability,
  } = data;

  if (!title || typeof title !== "string" || title.trim().length < 3) {
    throw new Error("Title is required and must be at least 3 characters");
  }
  if (typeof price !== "number" || price <= 0) {
    throw new Error("Price is required and must be a number greater than 0");
  }
  if (brand && (typeof brand !== "string" || brand.trim().length < 2)) {
    throw new Error("Brand must be at least 2 characters if provided");
  }
  if (imageUrl && !validator.isURL(imageUrl)) {
    throw new Error("A valid imageUrl is required");
  }
  if (
    rating !== undefined &&
    (typeof rating !== "number" || rating < 0 || rating > 5)
  ) {
    throw new Error("Rating must be a number between 0 and 5");
  }
  if (category && typeof category !== "string") {
    throw new Error("Category must be a string");
  }
  if (availability && !["In Stock", "Out of Stock"].includes(availability)) {
    throw new Error("Availability must be 'In Stock' or 'Out of Stock'");
  }
  if (description && typeof description !== "string") {
    throw new Error("Description must be a string");
  }
};

module.exports = { validateProductData };
