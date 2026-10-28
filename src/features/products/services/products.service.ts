import type { ItemResponse, Paginated } from "../../common/domain/api";
import { apiRequest } from "../../common/http";
import type { Product, ProductInput, ProductQuery } from "../domain/product";

const toSearchParams = (query: ProductQuery): string => {
    const params = new URLSearchParams({ page: String(query.page), limit: String(query.limit) });
    if (query.q) params.set("q", query.q);
    if (query.category) params.set("category", query.category);
    if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
    if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
    return params.toString();
};

export const productsService = {
    /** GET /api/products → { pagination, data } (público) */
    getAll(query: ProductQuery): Promise<Paginated<Product>> {
        return apiRequest<Paginated<Product>>(`/products?${toSearchParams(query)}`, {
            errorMessage: "No se pudo cargar el catálogo.",
        });
    },

    /** POST /api/products (admin) */
    async create(input: ProductInput): Promise<Product> {
        const { data } = await apiRequest<ItemResponse<Product>>("/products", {
            method: "POST",
            body: input,
            errorMessage: "No se pudo crear el producto.",
        });
        return data;
    },

    /** PUT /api/products/:id (admin) */
    async update(id: number, input: ProductInput): Promise<Product> {
        const { data } = await apiRequest<ItemResponse<Product>>(`/products/${id}`, {
            method: "PUT",
            body: input,
            errorMessage: "No se pudo actualizar el producto.",
        });
        return data;
    },

    /** DELETE /api/products/:id (admin) */
    async remove(id: number): Promise<void> {
        await apiRequest<{ message: string }>(`/products/${id}`, {
            method: "DELETE",
            errorMessage: "No se pudo eliminar el producto.",
        });
    },
};
