import { Suspense } from "react";
import { HeroSection } from "@/src/features/common/components/HeroSection";
import { Loading } from "@/src/features/common/components/StatusViews";
import { OrderSection } from "@/src/features/orders/components/OrderSection";
import { CatalogSection } from "@/src/features/products/components/CatalogSection";
import { CategorySection } from "@/src/features/products/components/CategorySection";

/** Inicio: las mismas cuatro secciones de la Entrega 1 (inicio, categorías, catálogo y pedido). */
export default function HomePage() {
    return (
        <>
            <HeroSection />
            {/* Las secciones leen la URL (?page=, ?category=, ?producto=) con useSearchParams: necesitan Suspense */}
            <Suspense fallback={<Loading message="Cargando el catálogo..." />}>
                <CategorySection />
                <CatalogSection />
                <OrderSection />
            </Suspense>
        </>
    );
}
