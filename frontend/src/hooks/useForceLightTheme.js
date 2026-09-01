/**
 * src/hooks/useForceLightTheme.js
 *
 * Forces the document theme to light while the calling page is mounted,
 * regardless of the current user's saved dark_mode preference (AuthContext
 * applies that preference app-wide via document.documentElement.dataset.theme).
 * Used by the pre-auth pages (Login/Signup/ForgotPassword) so a signed-in user
 * with dark mode on who navigates back to one of these URLs doesn't see them
 * rendered in dark mode. Restores the user's real preference on unmount,
 * mirroring AuthContext.jsx's own theme-application logic exactly.
 */
import { useEffect } from "react";
import { useAuth } from "../context/useAuth";

export function useForceLightTheme() {
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.dataset.theme = "light";
    return () => {
      document.documentElement.dataset.theme = user?.preferences?.dark_mode ? "dark" : "light";
    };
  }, [user?.preferences?.dark_mode]);
}
