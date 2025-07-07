import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="card bg-base-100 shadow-xl group relative" tabIndex={0}>
      <figure>
        <img
          src={product.image_url || product.imageUrl}
          alt={product.title}
          className="h-40 object-contain"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.title}</h2>
        <p className="text-sm text-gray-500">{product.brand}</p>
        <p className="font-bold">₹{product.price}</p>
        <div className="flex items-center gap-2">
          <span className="badge badge-info">{product.category}</span>
          <span
            className={`badge ${
              product.availability === "In Stock"
                ? "badge-success"
                : "badge-error"
            }`}
          >
            {product.availability}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
