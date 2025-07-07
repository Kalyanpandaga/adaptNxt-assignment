import React, { useEffect, useState } from "react";
import api from "../api/axios";
import toast, { Toaster } from "react-hot-toast";

const SHIPPING_COST = 10;

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCart = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/cart");
      setCart(res.data.cart);
    } catch {
      setError("Failed to load cart");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.post("/cart", { productId, quantity });
      fetchCart();
    } catch {
      setError("Failed to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      fetchCart();
    } catch {
      setError("Failed to remove item");
    }
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setSuccess("");
    setError("");
    try {
      await api.post("/orders");
      setSuccess("Order placed!");
      toast.success(
        <div className="text-center">
          <div className="font-bold text-lg">Congratulations!</div>
          <div>Your order is placed successfully.</div>
        </div>,
        {
          style: {
            borderRadius: "12px",
            background: "#18181b",
            color: "#fff",
            boxShadow: "0 4px 24px 0 #6366f1",
            fontSize: "1rem",
            padding: "1.2rem 1.5rem",
          },
          iconTheme: {
            primary: "#22c55e",
            secondary: "#fff",
          },
          position: "center",
          duration: 4000,
        }
      );
      fetchCart();
    } catch {
      setError("Failed to place order");
      toast.error(
        <div className="text-center">
          <div className="font-bold text-lg">Order Failed</div>
          <div>Something went wrong. Please try again.</div>
        </div>,
        {
          style: {
            borderRadius: "12px",
            background: "#18181b",
            color: "#fff",
            boxShadow: "0 4px 24px 0 #ef4444",
            fontSize: "1rem",
            padding: "1.2rem 1.5rem",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
          position: "center",
          duration: 4000,
        }
      );
    }
    setPlacing(false);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const total = subtotal + (cart.length > 0 ? SHIPPING_COST : 0);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Toaster position="center" />
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error mb-2">{error}</div>
      ) : cart.length === 0 ? (
        <div className="alert alert-info">Your cart is empty.</div>
      ) : (
        <>
          <div className="flex flex-col gap-6">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="card card-side bg-base-100 shadow flex flex-row items-center p-4"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="w-24 h-24 object-contain rounded-lg border"
                />
                <div className="flex-1 ml-6">
                  <div className="font-bold text-lg mb-1">
                    {item.product.title}
                  </div>
                  <div className="text-gray-500 mb-2">
                    ₹{item.product.price.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      className="btn btn-sm btn-circle btn-outline"
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity - 1)
                      }
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-2 text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-sm btn-circle btn-outline"
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-link text-error p-0 min-h-0 h-auto"
                    onClick={() => handleRemove(item.product._id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="text-xl font-bold ml-4">
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="divider"></div>
          <div className="flex flex-col gap-2 text-lg">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                ₹{cart.length > 0 ? SHIPPING_COST.toFixed(2) : "0.00"}
              </span>
            </div>
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          {success && <div className="alert alert-success mt-2">{success}</div>}
          <button
            className="btn btn-primary w-full mt-6"
            disabled={cart.length === 0 || placing}
            onClick={handlePlaceOrder}
          >
            {placing ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Proceed to Checkout"
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
