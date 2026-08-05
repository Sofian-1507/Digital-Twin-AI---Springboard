/**
 * src/context/AuthContext.jsx
 * Provides authentication state (user, isLoading) to the entire app.
 *
 * On mount, checks for an existing JWT in localStorage and fetches the
 * user profile from the backend to rehydrate the session automatically.
 */
import { useState, useEffect } from "react";
import { getUser } from "../services/userService";
import { logoutUser } from "../services/authService";
import { AuthContext } from "./authContextInstance";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while validating session

  // ── Apply the user's saved dark-mode preference to the document root ───────
  // This is a per-account preference (preferences.dark_mode via Settings),
  // not the OS color-scheme — see the `dark` custom variant in index.css.
  useEffect(() => {
    document.documentElement.dataset.theme = user?.preferences?.dark_mode ? "dark" : "light";
  }, [user?.preferences?.dark_mode]);

  // ── Restore session on initial app load ────────────────────────────────────
  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await getUser();
          setUser(userData);
        } catch {
          // Token is invalid or expired; clean it up
          logoutUser();
        }
      }
      setIsLoading(false);
    }
    restoreSession();
  }, []);

  /**
   * Called after a successful login or register API response.
   * The token has already been written to localStorage by authService.
   * @param {object} userData - the UserResponse or TokenResponse from the backend
   */
  const login = async (userData) => {
    if (!userData.profile) {
      try {
        const fullUser = await getUser();
        setUser(fullUser);
      } catch (err) {
        console.error("Failed to fetch full user on login:", err);
        setUser(userData);
      }
    } else {
      setUser(userData);
    }
  };

  /**
   * Clears the session on the client side.
   */
  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
