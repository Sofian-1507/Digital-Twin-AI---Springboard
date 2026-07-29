/**
 * src/context/AuthContext.jsx
 * Provides authentication state (user, isLoading) to the entire app.
 *
 * On mount, checks for an existing JWT in localStorage and fetches the
 * user profile from the backend to rehydrate the session automatically.
 */
import { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "../services/userService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while validating session

  // ── Restore session on initial app load ────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    // Token exists — validate it by fetching the user profile
    getUser()
      .then((userData) => setUser(userData))
      .catch(() => {
        // Token is invalid or expired; clean it up
        localStorage.removeItem("token");
      })
      .finally(() => setIsLoading(false));
  }, []);

  /**
   * Called after a successful login or register API response.
   * The token has already been written to localStorage by authService.
   * @param {object} userData - the UserResponse or TokenResponse from the backend
   */
  const login = (userData) => {
    setUser(userData);
  };

  /**
   * Clears the session on the client side.
   */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}