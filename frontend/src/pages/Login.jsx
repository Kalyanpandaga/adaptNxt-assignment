import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [errorMsg, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const onChangeEmailId = (e) => setEmailId(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);
  const onChangeFirstName = (e) => setFirstName(e.target.value);
  const onChangeLastName = (e) => setLastName(e.target.value);

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      await login(emailId, password);
      navigate("/");
    } catch (err) {
      setErrorMessage(err.response?.data?.errorMessage || "Login failed");
    }
    setLoading(false);
  };

  const onSubmitSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      await signup({ firstName, lastName, emailId, password });
      navigate("/");
    } catch (err) {
      setErrorMessage(err.response?.data?.errorMessage || "Signup failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center my-15">
      <div className="card bg-base-200 w-96 shadow-sm">
        <form
          className="card-body"
          onSubmit={isLoginForm ? onSubmitLogin : onSubmitSignUp}
        >
          <h2 className="card-title m-auto">
            {isLoginForm ? "Login Page" : "Sign Up Page"}
          </h2>
          {!isLoginForm && (
            <>
              <fieldset className="fieldset">
                <legend className="text-xs fieldset-legend">First Name:</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter Your First Name"
                  value={firstName}
                  onChange={onChangeFirstName}
                  required
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="text-xs fieldset-legend">Last Name</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter Your Last Name"
                  value={lastName}
                  onChange={onChangeLastName}
                  required
                />
              </fieldset>
            </>
          )}
          <fieldset className="fieldset">
            <legend className="text-xs fieldset-legend">Email Id:</legend>
            <input
              type="email"
              className="input"
              placeholder="Enter Your Email"
              value={emailId}
              onChange={onChangeEmailId}
              required
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="text-xs fieldset-legend">Password:</legend>
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={password}
              onChange={onChangePassword}
              required
            />
          </fieldset>
          <div className="card-actions justify-center mt-5">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : isLoginForm ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
          {errorMsg && <p className="text-warning"> * {errorMsg}</p>}
          <p
            className="text-center my-4 cursor-pointer text-blue-400"
            onClick={() => setIsLoginForm(!isLoginForm)}
          >
            {isLoginForm
              ? "You have no account, Sign up"
              : "You have an account, Login"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
