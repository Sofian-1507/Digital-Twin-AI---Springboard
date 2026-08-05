import { Navigate } from "react-router-dom";
import { logoutUser } from "../services/authService";

/** Decodes a JWT's payload without verifying its signature (server-side auth
 * still enforces that) — just enough to read the `exp` claim client-side. */
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true; // malformed token — treat as expired/invalid
  }
}

function ProtectedRoute({ children }) {

  const token =
    localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    if (token) logoutUser();
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
