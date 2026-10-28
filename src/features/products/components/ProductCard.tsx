"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "../../common/format";
import type { Product } from "../domain/product";
import { ProductImage } from "./ProductImage";

/** Tarjeta del catálogo: la misma de la Entrega 1, ahora con datos que llegan de la API. */
export function ProductCard({ product, onAddToOrder }: { product: Product; onAddToOrder: (product: Product) => void }) {
    const [isAdded, setAdded] = useState(false);

    // Confirmación breve en el propio botón (1,5 s), como en la Entrega 1
    useEffect(() => {
        if (!isAdded) return;
        const timer = setTimeout(() => setAdded(false), 1500);
        return () => clearTimeout(timer);
    }, [isAdded]);

    return (
        <article className="overflow-hidden rounded-lg border border-line bg-surface transition-[transform,box-shadow] duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_20px_rgba(59,42,32,0.12)]">
            <ProductImage product={product} className="h-[180px] md:h-[200px]" />
            <div className="p-[15px] md:p-5">
                <h3 className="mb-2.5 text-[1.1rem] font-bold text-wood-dark md:text-[1.25rem]">{product.name}</h3>
                <p className="mb-3 text-[0.95rem] leading-normal text-muted">{product.description}</p>
                <p className="mb-[15px] text-[1.3rem] font-bold text-wood">{formatPrice(product.price)}</p>
                <button
                    type="button"
                    onClick={() => {
                        setAdded(true);
                        onAddToOrder(product);
                    }}
                    className={`w-full p-2.5 font-bold text-white transition-[background-color,transform] duration-200 ${
                        isAdded ? "bg-success" : "bg-wood hover:-translate-y-0.5 hover:bg-wood-hover active:translate-y-0"
                    }`}
                >
                    {isAdded ? "Agregado" : "Agregar al pedido"}
                </button>
            </div>
        </article>
    );
}
