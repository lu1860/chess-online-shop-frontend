"use client";

import { useEffect, useState } from "react";
import { EMPTY_PAGE, getErrorMessage, type Paginated } from "../../common/domain/api";
import { ORDERS_PAGE_SIZE, type Order } from "../domain/order";
import { ordersService } from "../services/orders.service";

/** "mine" → mis pedidos; "all" → todos (panel de administración). */
export function useOrders(scope: "mine" | "all", page: number) {
    const [result, setResult] = useState<Paginated<Order>>(EMPTY_PAGE);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let isActive = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = scope === "mine" ? await ordersService.getMine(page, ORDERS_PAGE_SIZE) : await ordersService.getAll(page, ORDERS_PAGE_SIZE);
                if (isActive) setResult(data);
            } catch (loadError) {
                if (isActive) setError(getErrorMessage(loadError, "No se pudieron cargar los pedidos."));
            } finally {
                if (isActive) setLoading(false);
            }
        };
        load();
        return () => {
            isActive = false;
        };
    }, [scope, page, reloadKey]);

    return { orders: result.data, pagination: result.pagination, isLoading, error, reload: () => setReloadKey((key) => key + 1) };
}
