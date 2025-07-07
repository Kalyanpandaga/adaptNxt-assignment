import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AdminProducts from "./pages/AdminProducts";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const App = () => (
  <AuthProvider>
    <Router>
      <Navbar />
      <div className="max-w-5xl mx-auto px-2">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute requiredRole="CUSTOMER">
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminProducts />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  </AuthProvider>
);

export default App;
