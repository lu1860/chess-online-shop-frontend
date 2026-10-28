import { API_BASE_URL } from "./config";
import { ApiError, type FieldErrors } from "./domain/api";
import { sessionStore } from "./services/session.store";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
    method?: HttpMethod;
    body?: unknown;
    /** Mensaje si la API no explica el error. */
    errorMessage?: string;
}

const readErrorBody = async (response: Response): Promise<{ error?: string; fields?: FieldErrors }> => {
    try {
        const body: unknown = await response.json();
        if (body && typeof body === "object") return body as { error?: string; fields?: FieldErrors };
    } catch {
        // El cuerpo no era JSON (por ejemplo, una página de error del proveedor)
    }
    return {};
};

/**
 * Cliente HTTP centralizado: TODAS las peticiones a la API pasan por aquí.
 *  - Arma la URL con API_BASE_URL y envía el body como JSON.
 *  - Agrega "Authorization: Bearer <token>" automáticamente si hay sesión.
 *  - Convierte los errores en ApiError (código HTTP + mensaje + errores por campo).
 *  - Si la API responde 401 teniendo sesión (token vencido o inválido): cierra la sesión y lleva a /login.
 * Ningún componente llama a fetch: usan hooks, y los hooks usan servicios que llaman a esta función.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, errorMessage = "No se pudo completar la operación." } = options;

    const headers: Record<string, string> = { Accept: "application/json" };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const token = sessionStore.getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new ApiError(0, "No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.");
    }

    if (!response.ok) {
        const data = await readErrorBody(response);
        if (response.status === 401 && token && typeof window !== "undefined") {
            sessionStore.clear();
            const next = `${window.location.pathname}${window.location.search}`;
            // Este archivo no es un componente (no tiene useRouter): se navega con el navegador
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.assign(`/login?expirada=1&next=${encodeURIComponent(next)}`);
        }
        const message =
            response.status >= 500
                ? `${errorMessage} El servidor tuvo un problema (HTTP ${response.status}).`
                : (data.error ?? `${errorMessage} (HTTP ${response.status})`);
        throw new ApiError(response.status, message, data.fields ?? {});
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
}
