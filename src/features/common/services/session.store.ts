import { decodeToken, isTokenExpired, SESSION_COOKIE, type Role } from "../domain/session";

export interface SessionUser {
    id: number;
    name: string;
    email: string;
    role: Role;
}

export interface Session {
    token: string;
    user: SessionUser;
}

const USER_KEY = "chess_user";
const listeners = new Set<() => void>();
// undefined = todavía no se ha leído del navegador
let cached: Session | null | undefined;

const readCookie = (name: string): string | null => {
    const prefix = `${name}=`;
    const found = document.cookie.split("; ").find((part) => part.startsWith(prefix));
    return found ? decodeURIComponent(found.slice(prefix.length)) : null;
};

const removeStored = () => {
    document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    try {
        localStorage.removeItem(USER_KEY);
    } catch {
        // localStorage bloqueado (modo privado estricto): no hay nada que borrar
    }
};

/** Lee la sesión guardada. Si el token no existe, está dañado o venció, la sesión no cuenta. */
const readSession = (): Session | null => {
    const token = readCookie(SESSION_COOKIE);
    const payload = decodeToken(token);
    if (!token || !payload || isTokenExpired(payload)) {
        if (token) removeStored();
        return null;
    }
    try {
        const user = JSON.parse(localStorage.getItem(USER_KEY) ?? "null") as SessionUser | null;
        // El rol que manda es el del token (el que valida la API), no el guardado en localStorage
        if (!user || user.id !== payload.id) return null;
        return { token, user: { ...user, role: payload.role } };
    } catch {
        return null;
    }
};

const emit = () => listeners.forEach((listener) => listener());

/**
 * Almacén de la sesión, pensado para useSyncExternalStore.
 *  - El token va en una cookie (la lee proxy.ts para proteger rutas en el servidor).
 *  - Los datos públicos del usuario (nombre, email, rol) van en localStorage.
 * Así la sesión sobrevive al refrescar la página.
 */
export const sessionStore = {
    subscribe(listener: () => void): () => void {
        listeners.add(listener);
        // Si se cierra sesión en otra pestaña, esta también se entera
        const onStorage = (event: StorageEvent) => {
            if (event.key === USER_KEY || event.key === null) {
                cached = undefined;
                listener();
            }
        };
        window.addEventListener("storage", onStorage);
        return () => {
            listeners.delete(listener);
            window.removeEventListener("storage", onStorage);
        };
    },

    getSnapshot(): Session | null {
        if (cached === undefined) cached = readSession();
        // Si el token venció mientras la página estaba abierta, la sesión se cierra sola
        if (cached && isTokenExpired(decodeToken(cached.token) ?? { id: 0, role: "user", exp: 0 })) {
            removeStored();
            cached = null;
        }
        return cached;
    },

    /** En el servidor no hay cookies del navegador ni localStorage: se renderiza como invitado. */
    getServerSnapshot(): Session | null {
        return null;
    },

    getToken(): string | null {
        return typeof window === "undefined" ? null : (sessionStore.getSnapshot()?.token ?? null);
    },

    save(token: string, expiresIn: number, user: SessionUser): void {
        const secure = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${expiresIn}; SameSite=Lax${secure}`;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        cached = { token, user };
        emit();
    },

    /** Logout: borra el token (cookie) y los datos del usuario. */
    clear(): void {
        removeStored();
        cached = null;
        emit();
    },
};
