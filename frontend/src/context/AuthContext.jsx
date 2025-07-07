import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = async (emailId, password) => {
    const res = await api.post("/auth/login", { emailId, password });
    Cookies.set("token", res.data.token);
    await loadProfile();
  };

  const signup = async ({ firstName, lastName, emailId, password }) => {
    const res = await api.post("/auth/signup", {
      firstName,
      lastName,
      emailId,
      password,
    });
    Cookies.set("token", res.data.token);
    await loadProfile();
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const loadProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      loadProfile();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
