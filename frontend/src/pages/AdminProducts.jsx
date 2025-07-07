import React, { useEffect, useState } from "react";
import api from "../api/axios";

const initialForm = {
  title: "",
  price: "",
  brand: "",
  imageUrl: "",
  description: "",
  rating: "",
  category: "",
  availability: "In Stock",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [success, setSuccess] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setProducts(res.data.products);
    } catch {
      setError("Failed to load products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (type, product = initialForm) => {
    setModalType(type);
    setForm(product);
    setEditingId(type === "edit" ? product.id : null);
    setModalOpen(true);
    setSuccess("");
    setError("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(initialForm);
    setEditingId(null);
    setSuccess("");
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (modalType === "add") {
        await api.post("/products", {
          ...form,
          price: Number(form.price),
          rating: Number(form.rating),
        });
        setSuccess("Product added!");
      } else {
        await api.put(`/products/${editingId}`, {
          ...form,
          price: Number(form.price),
          rating: Number(form.rating),
        });
        setSuccess("Product updated!");
      }
      fetchProducts();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.errorMessage || "Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await api.delete(`/products/${id}`);
      setSuccess("Product deleted!");
      fetchProducts();
    } catch {
      setError("Failed to delete product");
    }
  };

  return (
    <div className="container mx-auto px-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Products</h2>
        <button className="btn btn-primary" onClick={() => openModal("add")}>
          Add Product
        </button>
      </div>
      {error && <div className="alert alert-error mb-2">{error}</div>}
      {success && <div className="alert alert-success mb-2">{success}</div>}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Category</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.brand}</td>
                  <td>₹{p.price}</td>
                  <td>{p.category}</td>
                  <td>
                    <span
                      className={`badge ${
                        p.availability === "In Stock"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {p.availability}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-xs btn-info mr-2"
                      onClick={() => openModal("edit", p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">
              {modalType === "add" ? "Add Product" : "Edit Product"}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                name="title"
                className="input input-bordered"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                required
                minLength={3}
              />
              <input
                name="brand"
                className="input input-bordered"
                placeholder="Brand"
                value={form.brand}
                onChange={handleChange}
                required
                minLength={2}
              />
              <input
                name="price"
                type="number"
                className="input input-bordered"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
                min={1}
              />
              <input
                name="imageUrl"
                className="input input-bordered"
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={handleChange}
                required
              />
              <input
                name="category"
                className="input input-bordered"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
              />
              <input
                name="rating"
                type="number"
                className="input input-bordered"
                placeholder="Rating (0-5)"
                value={form.rating}
                onChange={handleChange}
                min={0}
                max={5}
              />
              <select
                name="availability"
                className="select select-bordered"
                value={form.availability}
                onChange={handleChange}
              >
                <option>In Stock</option>
                <option>Out of Stock</option>
              </select>
              <textarea
                name="description"
                className="textarea textarea-bordered"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
              />
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
                <button type="button" className="btn" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
