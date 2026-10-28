"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Loading } from "../../common/components/StatusViews";
import { safeNextPath } from "../../common/domain/session";
import type { Role } from "../domain/auth";
import { useAuth } from "../hooks/useAuth";

/**
 * Protege una página en el navegador: sin sesión → /login; con un rol no permitido → inicio.
 * proxy.ts ya hace esta revisión en el servidor; esta es la segunda capa (por ejemplo, si la sesión
 * se cierra estando en la página). Ninguna de las dos reemplaza la protección real: la API (401/403).
 */
export function RequireAuth({ roles, children }: { roles?: Role[]; children: ReactNode }) {
    const { user, isReady } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const isAllowed = user !== null && (!roles || roles.includes(user.role));

    useEffect(() => {
        if (!isReady || isAllowed) return;
        router.replace(user ? "/" : `/login?next=${encodeURIComponent(pathname)}`);
    }, [isReady, isAllowed, user, router, pathname]);

    if (!isReady || !isAllowed) return <Loading message="Verificando tu sesión..." />;
    return <>{children}</>;
}

/** Para /login y /registro: con sesión activa no tiene sentido verlas, se redirige (a ?next= o al inicio). */
export function GuestOnly({ children }: { children: ReactNode }) {
    const { isAuthenticated, isReady } = useAuth();
    const router = useRouter();
    const next = safeNextPath(useSearchParams().get("next"));

    useEffect(() => {
        if (isReady && isAuthenticated) router.replace(next);
    }, [isReady, isAuthenticated, router, next]);

    if (!isReady || isAuthenticated) return <Loading />;
    return <>{children}</>;
}
