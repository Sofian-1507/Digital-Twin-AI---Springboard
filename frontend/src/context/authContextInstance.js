/**
 * src/context/authContextInstance.js
 * The raw React context object, split out from AuthContext.jsx (the
 * AuthProvider component) and useAuth.js (the hook) so each of those
 * files exports only one kind of thing — required for Vite Fast Refresh
 * to treat them as component-only / hook-only modules.
 */
import { createContext } from "react";

export const AuthContext = createContext();
