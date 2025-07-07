import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole)
    return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
