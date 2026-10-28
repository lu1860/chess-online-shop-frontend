"use client";

import { Pagination } from "../../common/components/Pagination";
import { EmptyState, ErrorState, Loading } from "../../common/components/StatusViews";
import type { ProductFilters } from "../domain/product";
import { useCatalogQuery } from "../hooks/useCatalogQuery";
import { useProducts } from "../hooks/useProducts";
import { CatalogFilters } from "./CatalogFilters";
import { ProductCard } from "./ProductCard";

/** Sección "Catálogo": los productos llegan de la API, paginados por la URL (?page=2). */
export function CatalogSection() {
    const { query, setPage, setFilters, clearFilters, selectForOrder } = useCatalogQuery();
    const { products, pagination, isLoading, error, reload } = useProducts(query);
    const { page } = query;
    const filters: ProductFilters = { q: query.q, category: query.category, minPrice: query.minPrice, maxPrice: query.maxPrice };
    const hasFilters = Object.values(filters).some((value) => value !== undefined);

    let content;
    if (isLoading) {
        content = <Loading message="Cargando el catálogo..." />;
    } else if (error) {
        content = <ErrorState title="No pudimos cargar el catálogo" message={error} onRetry={reload} />;
    } else if (products.length === 0) {
        content = (
            <EmptyState
                message={hasFilters ? "No hay productos que coincidan con estos filtros." : "No hay productos en el catálogo por ahora."}
                action={
                    hasFilters ? (
                        <button type="button" onClick={clearFilters} className="font-bold text-wood underline underline-offset-4">
                            Ver todo el catálogo
                        </button>
                    ) : undefined
                }
            />
        );
    } else {
        content = (
            <>
                <p className="mt-6 text-center text-sm text-muted" aria-live="polite">
                    {pagination.total === 1 ? "1 producto" : `${pagination.total} productos`}
                    {pagination.totalPages > 1 && ` · página ${page} de ${pagination.totalPages}`}
                </p>
                <div className="mt-[25px] grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] md:gap-[25px]">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} onAddToOrder={(selected) => selectForOrder(selected.id)} />
                    ))}
                </div>
            </>
        );
    }

    return (
        <section id="catalogo" aria-busy={isLoading} className="min-h-[250px] bg-cream px-[15px] py-[45px] md:px-5 md:py-[60px]">
            <h2 className="mb-[15px] text-center text-[1.7rem] font-bold leading-tight text-wood-dark md:text-[2rem]">Catálogo</h2>
            <p className="text-center text-muted">Consulta nuestro catálogo completo de productos.</p>

            <CatalogFilters key={JSON.stringify(filters)} filters={filters} onApply={setFilters} onClear={clearFilters} />

            {content}

            {!isLoading && !error && (
                <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
            )}
        </section>
    );
}
