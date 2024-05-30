import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { saveToken, saveUser } from "./userStorageService";
import "./style.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || "";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const token = response.headers.get("authorization")?.substring(7);
        const user = await response.json();
        if (token && user) {
          saveToken(token);
          saveUser(user);
          if (user.role === "ADMIN") {
            navigate("/admin");
            window.location.reload();
          } else {
            navigate("/products");
            window.location.reload();
          }
        }
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="login-container">
      {message && <p className="alert alert-warning">{message}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your email"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <div className="mt-3">
          <span>Don't have an account? </span>
          <Link to="/SignUp" className="btn btn-link">Register here</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
