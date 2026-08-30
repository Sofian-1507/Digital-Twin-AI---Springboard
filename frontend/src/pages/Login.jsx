import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/useAuth";
import { Input } from "../components/ui/Field";
import Button from "../components/ui/Button";
import { getApiErrorMessage } from "../utils/apiError";

const REMEMBER_ME_KEY = "digital_twin_remember_me";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Load previously saved login details, if Remember Me was selected.
  const savedLogin = (() => {
    try {
      const saved = localStorage.getItem(REMEMBER_ME_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const [formData, setFormData] = useState({
    email: savedLogin?.email || "",
    password: savedLogin?.password || "",
  });

  const [rememberMe, setRememberMe] = useState(!!savedLogin);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRememberMeChange = (e) => {
    const checked = e.target.checked;
    setRememberMe(checked);

    // If the user turns Remember Me off, remove saved credentials.
    if (!checked) {
      localStorage.removeItem(REMEMBER_ME_KEY);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save credentials only when Remember Me is selected.
      if (rememberMe) {
        localStorage.setItem(
          REMEMBER_ME_KEY,
          JSON.stringify({
            email: formData.email,
            password: formData.password,
          })
        );
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
      }

      const data = await loginUser(formData);
      await login(data);

      navigate("/dashboard");
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          "Invalid email or password. Please try again."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <div className="w-full max-w-md rounded-2xl border-t-4 border-t-indigo-600 bg-white p-8 shadow-xl sm:p-9 dark:bg-slate-800">

        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Digital Twin AI
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Welcome Back
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Login to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Email
            </label>

            <Input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="pr-11"
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between text-sm">

            <label className="flex cursor-pointer items-center gap-2 text-slate-500 dark:text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />

              Remember Me
            </label>

            <Link
              to="/forgot-password"
              className="font-medium text-indigo-600 hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}

          <Link
            to="/signup"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;