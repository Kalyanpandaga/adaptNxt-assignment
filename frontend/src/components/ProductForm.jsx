import React, { useState } from "react";

const initialState = {
  title: "",
  brand: "",
  price: "",
  imageUrl: "",
  description: "",
  category: "",
  rating: 0,
  availability: "In Stock",
};

const ProductForm = ({ initial, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(initial || initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label className="font-semibold">Title</label>
      <input
        name="title"
        className="input input-bordered"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        minLength={3}
      />
      <label className="font-semibold">Brand</label>
      <input
        name="brand"
        className="input input-bordered"
        placeholder="Brand"
        value={form.brand}
        onChange={handleChange}
        required
        minLength={2}
      />
      <label className="font-semibold">Price</label>
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
      <label className="font-semibold">Image URL</label>
      <input
        name="imageUrl"
        className="input input-bordered"
        placeholder="Image URL"
        value={form.imageUrl}
        onChange={handleChange}
        required
      />
      <label className="font-semibold">Category</label>
      <input
        name="category"
        className="input input-bordered"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
      />
      <label className="font-semibold">Rating (0-5)</label>
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
      <label className="font-semibold">Availability</label>
      <select
        name="availability"
        className="select select-bordered"
        value={form.availability}
        onChange={handleChange}
      >
        <option>In Stock</option>
        <option>Out of Stock</option>
      </select>
      <label className="font-semibold">Description</label>
      <textarea
        name="description"
        className="textarea textarea-bordered"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <div className="modal-action">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="loading loading-spinner"></span> : "Save"}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
