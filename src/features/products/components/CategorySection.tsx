"use client";

import { CATEGORIES } from "../domain/product";
import { useCatalogQuery } from "../hooks/useCatalogQuery";

/** Sección "Categorías Destacadas": los botones filtran el catálogo (la categoría queda en la URL). */
export function CategorySection() {
    const { query, setCategory } = useCatalogQuery();
    const options = [{ value: undefined, label: "Todos" }, ...CATEGORIES];

    return (
        <section id="categorias" className="border-y border-line bg-surface px-[15px] py-[45px] md:px-5 md:py-[60px]">
            <h2 className="mb-[25px] text-center text-[1.7rem] font-bold leading-tight text-wood-dark md:text-[2rem]">Categorías Destacadas</h2>
            <div className="mt-[30px] flex flex-wrap justify-center gap-[15px]">
                {options.map((option) => {
                    const isActive = query.category === option.value;
                    return (
                        <button
                            key={option.label}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => setCategory(option.value)}
                            className={`rounded-[5px] px-[18px] py-2.5 text-base font-bold text-white transition-[background-color,transform] duration-300 md:px-6 md:py-3 ${
                                isActive ? "bg-ink" : "bg-wood hover:-translate-y-0.5 hover:bg-wood-hover active:translate-y-0 active:bg-ink"
                            }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
