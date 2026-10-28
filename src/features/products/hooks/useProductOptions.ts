"use client";

import { useEffect, useState } from "react";
import { getErrorMessage } from "../../common/domain/api";
import { MAX_PAGE_SIZE, type Product } from "../domain/product";
import { productsService } from "../services/products.service";

/** Todos los productos activos, para el <select> del formulario de pedido. */
export function useProductOptions() {
    const [options, setOptions] = useState<Product[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;
        const load = async () => {
            try {
                const { data } = await productsService.getAll({ page: 1, limit: MAX_PAGE_SIZE });
                if (isActive) setOptions(data);
            } catch (loadError) {
                if (isActive) setError(getErrorMessage(loadError, "No se pudieron cargar los productos."));
            } finally {
                if (isActive) setLoading(false);
            }
        };
        load();
        return () => {
            isActive = false;
        };
    }, []);

    return { options, isLoading, error };
}
