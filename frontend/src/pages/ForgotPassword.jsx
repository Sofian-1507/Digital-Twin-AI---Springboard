import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { Input } from "../components/ui/Field";
import Button from "../components/ui/Button";
import { useForceLightTheme } from "../hooks/useForceLightTheme";

function ForgotPassword() {
  useForceLightTheme();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    // No password-reset endpoint exists in the backend yet — be honest about
    // that instead of pretending an email was sent.
    toast.info("Password reset isn't available yet. Please contact support to regain access to your account.");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <div className="w-full max-w-md rounded-2xl border-t-4 border-t-indigo-600 bg-white p-8 shadow-xl sm:p-9 dark:bg-slate-800">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Digital Twin AI</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-slate-100">Forgot Password</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Enter your email to receive a reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
            <Input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
