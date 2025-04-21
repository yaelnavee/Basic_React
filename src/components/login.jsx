import React, { useState } from "react";
import "./css/login.css";


const STORAGE_KEY = "users";

const getAllUsers = () => {
  const users = localStorage.getItem(STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

const registerUser = ({ username, email, password }) => {
  if (!username || !email || !password) {
    console.error("All fields are required 400");
    return { error: "All fields are required", status: 400 };

  }

  const users = getAllUsers();
  if (users.some((u) => u.username === username)) {
    console.error("Username already exists 409");
    return { error: "Username already exists", status: 409 };
  }

  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password,
    created: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

  const { password: _, ...userWithoutPassword } = newUser;
  console.log("User registered successfully 201", userWithoutPassword);
  return { user: userWithoutPassword, status: 201 };
};

const loginUser = ({ username, password }) => {
  const users = getAllUsers();

  const found = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!found) {
    console.error("Invalid username or password 401");
    return { error: "Invalid username or password", status: 401 };
  }

  const { password: _, ...userWithoutPassword } = found;
  console.log("User logged in successfully 200", userWithoutPassword);
  return { user: userWithoutPassword, status: 200 };
};

const Login = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const result = loginUser({
        username: formData.email,
        password: formData.password,
      });

      if (result.status === 200) {
        sessionStorage.setItem("currentUser", JSON.stringify(result.user));
        onSuccess(result.user.username);
      } else {
        setError(result.error);
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match!");
        return;
      }

      const result = registerUser({
        username: formData.email,
        email: formData.email,
        password: formData.password,
      });

      if (result.status === 201) {
        sessionStorage.setItem("currentUser", JSON.stringify(result.user));
        onSuccess(result.user.username);
      } else {
        setError(result.error);
      }
    }
  };

  return (
    // <div className="container">
    <div className="login-container">     
      <h2 className="login-title">{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <p className="login-error">{error}</p>}

        <div className="login-field">
          <label>Email:</label>
          <br></br>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="login-input"
          />
        </div>

        <div className="login-field">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="login-input"
          />
        </div>

        {!isLogin && (
          <div className="login-field">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="login-input"
            />
          </div>
        )}

        <button type="submit" className="login-button">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p className="login-switch">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
          className="login-switch-button"
        >
          {isLogin ? "Register here" : "Login here"}
        </button>
      </p>
    </div>
    // </div> 
  );
};

export default Login;
