import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

/**
 * Gates protected routes on AuthContext's session state, rather than reading a
 * token directly (auth is an httpOnly cookie now — JS can't read it at all, so
 * there's nothing to decode/check expiry on here; AuthContext's restoreSession
 * already asked the backend and knows whether the session is valid).
 */
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
