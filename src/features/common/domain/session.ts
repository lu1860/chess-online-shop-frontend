/**
 * Utilidades de la sesión que comparten el navegador y proxy.ts (que corre en el servidor de Next).
 * No dependen de window ni de React.
 */

/** Cookie donde se guarda el JWT. La lee proxy.ts para proteger las rutas antes de renderizarlas. */
export const SESSION_COOKIE = "chess_token";

export type Role = "admin" | "user";

export interface TokenPayload {
    id: number;
    role: Role;
    /** Expiración en segundos desde 1970 (claim "exp" del JWT). */
    exp: number;
}

/**
 * Lee el payload del JWT SIN verificar la firma (el frontend no tiene ni debe tener el JWT_SECRET).
 * Sirve solo para la experiencia de usuario: saber el rol y si ya venció.
 * Quien de verdad valida el token es la API, que responde 401 o 403.
 */
export const decodeToken = (token: string | undefined | null): TokenPayload | null => {
    if (!token) return null;
    const [, payload] = token.split(".");
    if (!payload) return null;
    try {
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const json = JSON.parse(atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")));
        if (typeof json?.id !== "number" || typeof json?.exp !== "number" || (json.role !== "admin" && json.role !== "user")) {
            return null;
        }
        return { id: json.id, role: json.role, exp: json.exp };
    } catch {
        return null;
    }
};

export const isTokenExpired = (payload: TokenPayload, nowMs: number = Date.now()): boolean =>
    payload.exp * 1000 <= nowMs;

/**
 * Valida el parámetro ?next= del login: solo rutas internas ("/algo").
 * Evita que un enlace malicioso lleve al usuario a otro sitio después de iniciar sesión.
 */
export const safeNextPath = (value: string | null | undefined, fallback = "/"): string =>
    value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : fallback;
