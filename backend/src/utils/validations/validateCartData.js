const validator = require("validator");

const validateCartData = (data) => {
  const { productId, quantity } = data;
  if (!productId || !validator.isMongoId(productId)) {
    throw new Error("A valid productId is required");
  }
  if (typeof quantity !== "number" || quantity < 1) {
    throw new Error("Quantity is required and must be a number greater than 0");
  }
};

module.exports = { validateCartData };
