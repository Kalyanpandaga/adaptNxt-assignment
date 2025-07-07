import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders", { params: { page, limit } });
      setOrders(res.data.orders || []);
      setTotal(res.data.total || 0);
    } catch {
      setError("Failed to load orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">
        {isAdmin ? "All Orders" : "Your Orders"}
      </h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error mb-2">{error}</div>
      ) : orders.length === 0 ? (
        <div className="alert alert-info">No orders found.</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Order ID</th>
                  {isAdmin && <th>User</th>}
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="hover">
                    <td className="font-mono text-xs">{order.id}</td>
                    {isAdmin && (
                      <td>
                        {order.user ? (
                          <div>
                            <div className="font-semibold">
                              {order.user.firstName} {order.user.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {order.user.user_id}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    )}
                    <td>
                      <ul className="list-disc ml-4">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            <span className="font-semibold">{item.title}</span>{" "}
                            x{item.quantity}{" "}
                            <span className="text-gray-500">₹{item.price}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="font-bold">₹{order.totalAmount}</td>
                    <td>
                      <span className="badge badge-info badge-outline">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
              <button
                key={i}
                className={`btn btn-sm ${
                  page === i + 1 ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
