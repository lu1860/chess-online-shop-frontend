import { NextResponse, type NextRequest } from "next/server";
import { decodeToken, isTokenExpired, safeNextPath, SESSION_COOKIE } from "./src/features/common/domain/session";

const PRIVATE_PATHS = ["/mis-pedidos", "/admin"];
const ADMIN_PATHS = ["/admin"];
const GUEST_PATHS = ["/login", "/registro"];

const matches = (pathname: string, paths: string[]) =>
    paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

/**
 * Protección de rutas EN EL SERVIDOR, antes de renderizar la página.
 * Lee el token de la cookie y revisa su rol y su expiración:
 *  - /mis-pedidos y /admin sin sesión → /login?next=...
 *  - /admin con rol user → inicio
 *  - /login y /registro con sesión → inicio (o a la ruta de ?next=)
 * Next.js no tiene el JWT_SECRET, así que no verifica la firma: eso lo hace la API en cada petición
 * (401/403). Esta capa evita mostrar pantallas a quien no corresponde.
 */
export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const payload = decodeToken(token);
    const session = payload && !isTokenExpired(payload) ? payload : null;

    if (matches(pathname, PRIVATE_PATHS) && !session) {
        const login = new URL("/login", request.url);
        login.searchParams.set("next", `${pathname}${search}`);
        const response = NextResponse.redirect(login);
        // Una cookie vencida o dañada no sirve: se borra
        if (token) response.cookies.delete(SESSION_COOKIE);
        return response;
    }

    if (matches(pathname, ADMIN_PATHS) && session?.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (matches(pathname, GUEST_PATHS) && session) {
        return NextResponse.redirect(new URL(safeNextPath(request.nextUrl.searchParams.get("next")), request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/mis-pedidos/:path*", "/admin/:path*", "/login", "/registro"],
};
