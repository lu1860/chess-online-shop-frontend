/* eslint-disable @next/next/no-img-element -- las imágenes pueden ser URLs externas que escribe el administrador */
import type { Product } from "../domain/product";

/** Imagen del producto con el fondo de respaldo de la Entrega 1 mientras carga. */
export function ProductImage({ product, className = "" }: { product: Pick<Product, "image" | "imageAlt">; className?: string }) {
    return (
        <div className={`overflow-hidden bg-placeholder ${className}`}>
            <img src={product.image} alt={product.imageAlt} loading="lazy" width={400} height={300} className="h-full w-full object-cover" />
        </div>
    );
}
