/** Mapa campo → mensaje que devuelve la API en los errores 400 y 409. */
export type FieldErrors = Record<string, string>;

export interface Pagination {
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
}

/** Respuesta paginada de la API: { pagination, data } */
export interface Paginated<T> {
    pagination: Pagination;
    data: T[];
}

/** Respuesta de un solo recurso: { data } (algunas traen además message). */
export interface ItemResponse<T> {
    message?: string;
    data: T;
}

export const EMPTY_PAGE: Paginated<never> = {
    pagination: { total: 0, currentPage: 1, limit: 0, totalPages: 0 },
    data: [],
};

/** Error de la API con su código HTTP y, si los hay, los errores por campo. */
export class ApiError extends Error {
    readonly status: number;
    readonly fields: FieldErrors;

    constructor(status: number, message: string, fields: FieldErrors = {}) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.fields = fields;
    }
}

/** Convierte cualquier error en un texto para mostrar. React no puede pintar un objeto Error. */
export const getErrorMessage = (error: unknown, fallback = "Ocurrió un error inesperado."): string =>
    error instanceof Error && error.message ? error.message : fallback;
