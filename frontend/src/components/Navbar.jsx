import React from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow mb-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          shopLoom
        </Link>
        {isAuthenticated && user?.role === "ADMIN" && (
          <span className="badge badge-primary ml-2">Admin</span>
        )}
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          {isAuthenticated && user?.role === "CUSTOMER" && (
            <li>
              <Link to="/cart">Cart</Link>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <Link to="/orders">
                {user?.role === "ADMIN" ? "All Orders" : "Orders"}
              </Link>
            </li>
          )}
          {!isAuthenticated ? (
            <li>
              <Link to="/login">Login</Link>
            </li>
          ) : (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
