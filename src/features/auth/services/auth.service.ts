import type { ItemResponse } from "../../common/domain/api";
import { apiRequest } from "../../common/http";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../domain/auth";

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const { data } = await apiRequest<ItemResponse<AuthResponse>>("/auth/login", {
            method: "POST",
            body: credentials,
            errorMessage: "No se pudo iniciar sesión.",
        });
        return data;
    },

    async register(payload: RegisterRequest): Promise<User> {
        const { data } = await apiRequest<ItemResponse<User>>("/auth/register", {
            method: "POST",
            body: payload,
            errorMessage: "No se pudo crear la cuenta.",
        });
        return data;
    },
};
