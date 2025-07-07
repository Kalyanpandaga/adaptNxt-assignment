import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";
import { useAuth } from "../context/AuthContext";

const Products = () => {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "ADMIN";
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

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

  const openAddModal = () => {
    setModalOpen(true);
    setError("");
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleFormSubmit = async (form) => {
    setFormLoading(true);
    try {
      await api.post("/products", form);
      window.toast && window.toast.success("Product added!");
      fetchProducts();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.errorMessage || "Failed to add product");
    }
    setFormLoading(false);
  };

  return (
    <div className="container mx-auto px-2">
      <div className="flex flex-col md:flex-row gap-2 mb-4 items-center justify-between">
        <div className="flex gap-2 w-full md:w-auto">
          <input
            className="input input-bordered w-full md:w-64"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-outline" onClick={() => setPage(1)}>
            Search
          </button>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openAddModal}>
            Add Product
          </button>
        )}
      </div>
      {error && <div className="alert alert-error mb-2">{error}</div>}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : products.length === 0 ? (
        <div className="alert alert-info">
          There are no products for this filter. Try adjusting your search.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <Link
                key={p.id || p._id}
                to={`/products/${p.id || p._id}`}
                className="block"
              >
                <ProductCard product={p} />
              </Link>
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
      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">Add Product</h3>
            <ProductForm
              onSubmit={handleFormSubmit}
              onCancel={closeModal}
              loading={formLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
