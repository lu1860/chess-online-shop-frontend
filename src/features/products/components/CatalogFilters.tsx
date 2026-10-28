"use client";

import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { ProductFilters } from "../domain/product";

interface CatalogFiltersProps {
    filters: ProductFilters;
    onApply: (filters: Pick<ProductFilters, "q" | "minPrice" | "maxPrice">) => void;
    onClear: () => void;
}

const fieldClass =
    "w-full rounded-[5px] border border-field bg-white px-3 py-2.5 text-ink transition-[border-color,box-shadow] hover:border-wood-light focus:border-wood focus:shadow-[0_0_0_2px_rgba(107,79,58,0.15)] focus:outline-none";

const toPrice = (value: string): number | undefined => {
    const clean = value.replace(/\D/g, "");
    return clean ? Number(clean) : undefined;
};

/** Búsqueda por texto y rango de precio. Se combinan con la categoría elegida arriba. */
export function CatalogFilters({ filters, onApply, onClear }: CatalogFiltersProps) {
    // key en el padre reinicia este estado cuando los filtros de la URL cambian
    const [q, setQ] = useState(filters.q ?? "");
    const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() ?? "");
    const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() ?? "");
    const [error, setError] = useState<string | null>(null);

    const hasFilters = Boolean(filters.q || filters.category || filters.minPrice !== undefined || filters.maxPrice !== undefined);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const min = toPrice(minPrice);
        const max = toPrice(maxPrice);
        if (min !== undefined && max !== undefined && min > max) {
            setError("El precio mínimo no puede ser mayor que el máximo.");
            return;
        }
        setError(null);
        onApply({ q: q.trim() || undefined, minPrice: min, maxPrice: max });
    };

    return (
        <form onSubmit={handleSubmit} noValidate role="search" aria-label="Filtrar catálogo" className="mx-auto mt-[30px] max-w-[900px] rounded-lg border border-line bg-surface p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
                <label className="block">
                    <span className="mb-1 block text-sm font-bold text-ink">Buscar</span>
                    <input type="search" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Ej: Staunton, reloj, aperturas" maxLength={100} className={fieldClass} />
                </label>
                <label className="block">
                    <span className="mb-1 block text-sm font-bold text-ink">Precio mínimo</span>
                    <input inputMode="numeric" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="$0" aria-invalid={error ? true : undefined} className={fieldClass} />
                </label>
                <label className="block">
                    <span className="mb-1 block text-sm font-bold text-ink">Precio máximo</span>
                    <input inputMode="numeric" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Sin límite" aria-invalid={error ? true : undefined} className={fieldClass} />
                </label>
            </div>
            {error && (
                <p role="alert" className="mt-2 text-[0.9rem] text-danger">
                    {error}
                </p>
            )}
            <div className="mt-4 flex flex-wrap justify-end gap-2">
                {hasFilters && (
                    <button type="button" onClick={onClear} className="rounded-[5px] px-4 py-2.5 font-bold text-muted transition-colors hover:bg-cream hover:text-ink">
                        Quitar filtros
                    </button>
                )}
                <button type="submit" className="inline-flex items-center gap-2 rounded-[5px] bg-wood-dark px-5 py-2.5 font-bold text-white transition-colors hover:bg-wood-hover">
                    <Search className="h-4 w-4" aria-hidden="true" />
                    Filtrar
                </button>
            </div>
        </form>
    );
}
