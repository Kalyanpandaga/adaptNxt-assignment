import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Products = () => {
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      const res = await api.get("/products", { params });
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch {
      setError("Failed to load products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [page, search]);

  const handleAddToCart = async (productId) => {
    setAdding(productId);
    try {
      await api.post("/cart", { productId, quantity: 1 });
      window.toast && window.toast.success("Added to cart!");
    } catch {
      window.toast && window.toast.error("Failed to add to cart");
    }
    setAdding("");
  };

  console.log(products);

  return (
    <div className="container mx-auto px-2">
      <div className="flex flex-col md:flex-row gap-2 mb-4 items-center">
        <input
          className="input input-bordered w-full md:w-1/3"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-outline" onClick={() => setPage(1)}>
          Search
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error mb-2">{error}</div>
      ) : products.length === 0 ? (
        <div className="alert alert-info">
          There are no products for this filter. Try adjusting your search or
          category.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <div key={p.id} className="card bg-base-100 shadow-xl">
                <figure>
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="h-40 object-contain"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{p.title}</h2>
                  <p className="text-sm text-gray-500">{p.brand}</p>
                  <p className="font-bold">₹{p.price}</p>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-info">{p.category}</span>
                    <span
                      className={`badge ${
                        p.availability === "In Stock"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {p.availability}
                    </span>
                  </div>
                  <div className="card-actions justify-end mt-2">
                    {isAuthenticated && user?.role === "CUSTOMER" && (
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={adding === p.id}
                        onClick={() => handleAddToCart(p.id)}
                      >
                        {adding === p.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          "Add to Cart"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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

export default Products;
