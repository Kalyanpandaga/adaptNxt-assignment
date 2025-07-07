import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
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

  const handleRemove = async (productTitle) => {
    const item = cart.find((c) => c.product.title === productTitle);
    if (!item) return;
    try {
      await api.delete(`/cart/${item.product.title}`);
      fetchCart();
    } catch {
      window.toast && window.toast.error("Failed to remove item");
    }
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      await api.post("/orders");
      window.toast && window.toast.success("Order placed!");
      fetchCart();
    } catch {
      window.toast && window.toast.error("Failed to place order");
    }
    setPlacing(false);
  };

  return (
    <div className="container mx-auto px-2">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
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
          <ul className="divide-y">
            {cart.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between py-3">
                <div>
                  <span className="font-semibold">{item.product.title}</span>{" "}
                  <span className="text-gray-500">x{item.quantity}</span>
                  <span className="ml-2">₹{item.product.price}</span>
                </div>
                <button
                  className="btn btn-error btn-xs"
                  onClick={() => handleRemove(item.product.title)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            className="btn btn-primary mt-6"
            onClick={handlePlaceOrder}
            disabled={placing}
          >
            {placing ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Place Order"
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
