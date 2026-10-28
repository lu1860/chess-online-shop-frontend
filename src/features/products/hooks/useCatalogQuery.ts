"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { CATALOG_PAGE_SIZE, isCategory, type ProductFilters, type ProductQuery } from "../domain/product";

const toPage = (value: string | null): number => {
    const page = Number(value);
    return Number.isInteger(page) && page >= 1 ? page : 1;
};

const toPrice = (value: string | null): number | undefined => {
    if (!value) return undefined;
    const price = Number(value);
    return Number.isInteger(price) && price >= 0 ? price : undefined;
};

/**
 * La página y los filtros del catálogo viven en la URL (?page=2&category=piezas&q=...).
 * Así se pueden compartir, sobreviven al refrescar y el botón "atrás" funciona.
 */
export function useCatalogQuery() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const query = useMemo<ProductQuery>(() => {
        const category = searchParams.get("category");
        const q = searchParams.get("q")?.trim();
        return {
            page: toPage(searchParams.get("page")),
            limit: CATALOG_PAGE_SIZE,
            ...(q && { q }),
            ...(isCategory(category) && { category }),
            ...(toPrice(searchParams.get("minPrice")) !== undefined && { minPrice: toPrice(searchParams.get("minPrice")) }),
            ...(toPrice(searchParams.get("maxPrice")) !== undefined && { maxPrice: toPrice(searchParams.get("maxPrice")) }),
        };
    }, [searchParams]);

    /** Cambia parámetros de la URL sin recargar ni mover el scroll. undefined borra el parámetro. */
    const updateParams = useCallback(
        (changes: Record<string, string | undefined>, mode: "push" | "replace" = "replace") => {
            const params = new URLSearchParams(searchParams.toString());
            for (const [key, value] of Object.entries(changes)) {
                if (value === undefined || value === "") params.delete(key);
                else params.set(key, value);
            }
            const queryString = params.toString();
            const url = queryString ? `${pathname}?${queryString}` : pathname;
            router[mode](url, { scroll: false });
        },
        [searchParams, pathname, router],
    );

    const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

    return {
        query,
        /** Cambiar de página agrega una entrada al historial (el botón "atrás" vuelve a la anterior). */
        setPage: (page: number) => {
            updateParams({ page: page > 1 ? String(page) : undefined }, "push");
            scrollTo("catalogo");
        },
        /** Un filtro nuevo siempre vuelve a la página 1. */
        setCategory: (category: ProductFilters["category"]) => updateParams({ category, page: undefined }),
        setFilters: (filters: Pick<ProductFilters, "q" | "minPrice" | "maxPrice">) =>
            updateParams({
                q: filters.q,
                minPrice: filters.minPrice !== undefined ? String(filters.minPrice) : undefined,
                maxPrice: filters.maxPrice !== undefined ? String(filters.maxPrice) : undefined,
                page: undefined,
            }),
        clearFilters: () => updateParams({ q: undefined, minPrice: undefined, maxPrice: undefined, category: undefined, page: undefined }),
        /** "Agregar al pedido": deja el producto elegido en la URL y baja al formulario. */
        selectForOrder: (productId: number) => {
            updateParams({ producto: String(productId) });
            scrollTo("pedido");
        },
    };
}
