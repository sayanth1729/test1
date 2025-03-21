import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data.username, data.role);
      } else {
        const err = await response.json();
        setError(err.message || "Invalid username or password.");
      }
    } catch (e) {
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="User Icon"
            className="user-icon"
          />
          <h1>Sign In</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type Your Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-box"
          />
          <input
            type="password"
            placeholder="Type Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-box"
          />
          <button type="submit" className="sign-in-button">
            Sign In
          </button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
};

export default Login;
