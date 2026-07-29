import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Auth.css";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    // No backend endpoint yet — show informational toast
    setIsLoading(true);
    setTimeout(() => {
      toast.info("If that email exists, a reset link has been sent.");
      setEmail("");
      setIsLoading(false);
    }, 800);
  };

  return (

    <div className="auth-container">

      <div className="auth-card">

        <div className="auth-header">

          <h1>Forgot Password</h1>

          <p>
            Enter your email to receive a reset link.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>

          <button className="auth-btn" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        <p className="switch-auth">

          <Link to="/login">
            Back to Login
          </Link>

        </p>

      </div>

    </div>

  );
}

export default ForgotPassword;