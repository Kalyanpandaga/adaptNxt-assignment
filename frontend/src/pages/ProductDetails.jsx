import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ProductForm from "../components/ProductForm";

const ProductDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "ADMIN";
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch {
      setProduct(null);
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setAddLoading(true);
    try {
      await api.post("/cart", {
        productId: product.id || product._id,
        quantity,
      });
      window.toast && window.toast.success("Added to cart!");
    } catch {
      window.toast && window.toast.error("Failed to add to cart");
    }
    setAddLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${product.id || product._id}`);
      window.toast && window.toast.success("Product deleted");
      navigate("/products");
    } catch {
      window.toast && window.toast.error("Failed to delete product");
    }
  };

  const openEditModal = () => {
    setEditModalOpen(true);
    setFormError("");
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const handleEditSubmit = async (form) => {
    setFormLoading(true);
    try {
      await api.put(`/products/${product.id || product._id}`, form);
      window.toast && window.toast.success("Product updated!");
      fetchProduct();
      closeEditModal();
    } catch (err) {
      setFormError(
        err.response?.data?.errorMessage || "Failed to update product"
      );
    }
    setFormLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  if (!product) {
    return <div className="alert alert-error">Product not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      <div className="flex-1 flex justify-center items-center">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="rounded-2xl w-full max-w-md object-contain"
        />
      </div>
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
        <div className="text-2xl font-semibold mb-2">Rs {product.price}/-</div>
        <div className="flex items-center gap-2 mb-2">
          <span className="btn btn-sm btn-info">{product.rating || 0} ★</span>
          <span className="text-gray-500">879 Reviews</span>
        </div>
        <p className="mb-4">{product.description}</p>
        <div className="mb-2">
          <span className="font-semibold">Available:</span>{" "}
          <span
            className={
              product.availability === "In Stock"
                ? "text-success"
                : "text-error"
            }
          >
            {product.availability}
          </span>
        </div>
        <div className="mb-4">
          <span className="font-semibold">Brand:</span> {product.brand}
        </div>
        <hr className="mb-4" />
        {!isAdmin && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-2 text-lg font-semibold">{quantity}</span>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              className="btn btn-primary w-full"
              onClick={handleAddToCart}
              disabled={addLoading}
            >
              {addLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "ADD TO CART"
              )}
            </button>
          </>
        )}
        {isAdmin && (
          <div className="flex gap-2 mt-4">
            <button className="btn btn-info" onClick={openEditModal}>
              Edit
            </button>
            <button className="btn btn-error" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">Login Required</h3>
            <p className="mb-4">Login to add the items in your cart.</p>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button className="btn" onClick={() => setShowLoginModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">Edit Product</h3>
            {formError && (
              <div className="alert alert-error mb-2">{formError}</div>
            )}
            <ProductForm
              initial={product}
              onSubmit={handleEditSubmit}
              onCancel={closeEditModal}
              loading={formLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
