import React from "react";
import { Link } from "react-router";

const Home = () => (
  <div className="hero min-h-[60vh] bg-base-200 rounded-box">
    <div className="hero-content flex-col lg:flex-row">
      <div>
        <h1 className="text-5xl font-bold">Welcome to shopLoom!</h1>
        <p className="py-6 text-lg">
          Your one-stop shop for groceries and essentials. Discover quality
          products at the best prices.
        </p>
        <Link to="/products" className="btn btn-primary">
          Shop Now
        </Link>
      </div>
    </div>
  </div>
);

export default Home;
