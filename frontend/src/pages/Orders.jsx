import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      setOrders(res.data.orders || (res.data.order ? [res.data.order] : []));
    } catch {
      setError("Failed to load orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-2">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error mb-2">{error}</div>
      ) : orders.length === 0 ? (
        <div className="alert alert-info">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    {order.items.map((item, idx) => (
                      <div key={idx}>
                        {item.title} x{item.quantity}{" "}
                        <span className="text-gray-500">₹{item.price}</span>
                      </div>
                    ))}
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    <span className="badge badge-info">{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
