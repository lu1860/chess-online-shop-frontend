"use client";

import { useEffect, useState } from "react";
import { EMPTY_PAGE, getErrorMessage, type Paginated } from "../../common/domain/api";
import type { Product, ProductQuery } from "../domain/product";
import { productsService } from "../services/products.service";

/**
 * Carga una página de productos con sus estados: cargando, error y datos (que pueden venir vacíos).
 * Se vuelve a ejecutar cada vez que cambia la consulta (página o filtros) o se pide reintentar.
 */
export function useProducts(query: ProductQuery) {
    const [result, setResult] = useState<Paginated<Product>>(EMPTY_PAGE);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);
    // Las dependencias del efecto deben ser valores simples: el objeto query cambia en cada render
    const queryKey = JSON.stringify(query);

    useEffect(() => {
        // Evita que una respuesta lenta de una consulta anterior pise la actual
        let isActive = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await productsService.getAll(JSON.parse(queryKey) as ProductQuery);
                if (isActive) setResult(data);
            } catch (loadError) {
                if (isActive) setError(getErrorMessage(loadError, "No se pudo cargar el catálogo."));
            } finally {
                if (isActive) setLoading(false);
            }
        };
        load();
        return () => {
            isActive = false;
        };
    }, [queryKey, reloadKey]);

    const reload = () => setReloadKey((key) => key + 1);

    return { products: result.data, pagination: result.pagination, isLoading, error, reload };
}
