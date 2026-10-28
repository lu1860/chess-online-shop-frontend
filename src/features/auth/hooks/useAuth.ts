"use client";

import { createContext, useContext } from "react";
import type { LoginRequest, User } from "../domain/auth";

export interface AuthContextValue {
    /** Usuario de la sesión actual, o null si es un invitado. */
    user: User | null;
    /** false mientras se lee la sesión guardada; evita redirigir al login antes de saber si hay sesión. */
    isReady: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (credentials: LoginRequest) => Promise<User>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

/** Sesión actual, login y logout. Se usa dentro de <SessionProvider> (está en el layout raíz). */
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth solo se puede usar dentro de <SessionProvider>");
    }
    return context;
}
