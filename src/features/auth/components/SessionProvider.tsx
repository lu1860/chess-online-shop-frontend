"use client";

import { useCallback, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { sessionStore } from "../../common/services/session.store";
import type { LoginRequest } from "../domain/auth";
import { authService } from "../services/auth.service";
import { AuthContext, type AuthContextValue } from "../hooks/useAuth";

const subscribeNothing = () => () => undefined;

/**
 * Comparte la sesión con toda la aplicación.
 * La sesión vive en sessionStore (cookie + localStorage), por eso sobrevive al refrescar la página.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
    const session = useSyncExternalStore(sessionStore.subscribe, sessionStore.getSnapshot, sessionStore.getServerSnapshot);
    // false en el servidor y durante la hidratación; true cuando ya se puede leer la cookie del navegador
    const isReady = useSyncExternalStore(subscribeNothing, () => true, () => false);

    const login = useCallback(async (credentials: LoginRequest) => {
        const { user, token } = await authService.login(credentials);
        sessionStore.save(token.accessToken, token.expiresIn, user);
        return user;
    }, []);

    const logout = useCallback(() => {
        sessionStore.clear();
    }, []);

    const value = useMemo<AuthContextValue>(() => {
        const user = session?.user ?? null;
        return {
            user,
            isReady,
            isAuthenticated: user !== null,
            isAdmin: user?.role === "admin",
            login,
            logout,
        };
    }, [session, isReady, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
