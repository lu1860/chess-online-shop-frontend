import type { ItemResponse, Paginated } from "../../common/domain/api";
import { apiRequest } from "../../common/http";
import type { Order, OrderRequest } from "../domain/order";

const pageQuery = (page: number, limit: number) => new URLSearchParams({ page: String(page), limit: String(limit) }).toString();

export const ordersService = {
    /** POST /api/orders (con sesión) */
    async create(order: OrderRequest): Promise<Order> {
        const { data } = await apiRequest<ItemResponse<Order>>("/orders", {
            method: "POST",
            body: order,
            errorMessage: "No se pudo registrar el pedido.",
        });
        return data;
    },

    /** GET /api/orders/mias (con sesión): solo los del usuario del token */
    getMine(page: number, limit: number): Promise<Paginated<Order>> {
        return apiRequest<Paginated<Order>>(`/orders/mias?${pageQuery(page, limit)}`, {
            errorMessage: "No se pudieron cargar tus pedidos.",
        });
    },

    /** GET /api/orders (solo admin): todos los pedidos */
    getAll(page: number, limit: number): Promise<Paginated<Order>> {
        return apiRequest<Paginated<Order>>(`/orders?${pageQuery(page, limit)}`, {
            errorMessage: "No se pudieron cargar los pedidos.",
        });
    },
};
