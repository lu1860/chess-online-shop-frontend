import type { User } from "../../auth/domain/auth";
import type { ProductCategory } from "../../products/domain/product";

/** Igual que en la Entrega 1: máximo 20 unidades por pedido. */
export const MAX_QUANTITY = 20;
export const ORDERS_PAGE_SIZE = 10;

export type OrderStatus = "PENDIENTE" | "CONFIRMADO" | "ENVIADO" | "CANCELADO";

export const STATUS_LABELS: Record<OrderStatus, string> = {
    PENDIENTE: "Pendiente",
    CONFIRMADO: "Confirmado",
    ENVIADO: "Enviado",
    CANCELADO: "Cancelado",
};

export interface Order {
    id: number;
    customerName: string;
    customerEmail: string;
    quantity: number;
    unitPrice: number;
    total: number;
    status: OrderStatus;
    createdAt: string;
    product: {
        id: number;
        name: string;
        category: ProductCategory;
        image: string;
        imageAlt: string;
    };
    /** Solo llega en el listado del administrador. */
    user?: User;
}

/** Body de POST /api/orders. No lleva el usuario: la API lo toma del token. */
export interface OrderRequest {
    productId: number;
    quantity: number;
    customerName: string;
    customerEmail: string;
}

/** Valores del formulario (todo texto, como llega de los inputs). */
export interface OrderFormValues {
    customerName: string;
    customerEmail: string;
    productId: string;
    quantity: string;
}
