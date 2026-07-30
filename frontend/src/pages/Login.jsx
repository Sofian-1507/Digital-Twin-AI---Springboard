import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import "../styles/Auth.css";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginUser(formData);
      await login(data);
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        "Invalid email or password. Please try again.";
      toast.error(typeof msg === "string" ? msg : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <div className="auth-header">

          <h1>Digital Twin AI</h1>

          <h2>Welcome Back 👋</h2>

          <p>Login to continue</p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <div className="password-box">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>

            </div>

          </div>

          <div className="remember-row">

            <label>

              <input type="checkbox" />

              Remember Me

            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          <button className="auth-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="switch-auth">

          Don't have an account?

          <Link to="/signup">
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;