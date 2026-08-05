/**
 * src/context/useAuth.js
 * Hook for consuming AuthContext. Split into its own file (separate from
 * AuthContext.jsx, which exports only the AuthProvider component) so Vite's
 * Fast Refresh can treat AuthContext.jsx as a component-only module.
 */
import { useContext } from "react";
import { AuthContext } from "./authContextInstance";

export function useAuth() {
  return useContext(AuthContext);
}
