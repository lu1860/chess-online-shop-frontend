import type { Role } from "../../common/domain/session";

export type { Role };

/** Usuario tal como lo devuelve la API (nunca trae la contraseña). */
export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthToken {
    accessToken: string;
    tokenType: "Bearer";
    /** Segundos de vida del token. */
    expiresIn: number;
}

export interface AuthResponse {
    user: User;
    token: AuthToken;
}

/** Valores del formulario de registro (incluye la confirmación, que no se envía a la API). */
export interface RegisterFormValues extends RegisterRequest {
    confirmPassword: string;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
