import { Suspense } from "react";
import { HeroSection } from "@/src/features/common/components/HeroSection";
import { Loading } from "@/src/features/common/components/StatusViews";
import { CatalogSection } from "@/src/features/products/components/CatalogSection";
import { CategorySection } from "@/src/features/products/components/CategorySection";

/** Inicio: secciones de la Entrega 1. La sección de pedido se agrega en el paso 6. */
export default function HomePage() {
    return (
        <>
            <HeroSection />
            {/* Las secciones leen la URL (?page=, ?category=) con useSearchParams: necesitan Suspense */}
            <Suspense fallback={<Loading message="Cargando el catálogo..." />}>
                <CategorySection />
                <CatalogSection />
            </Suspense>
        </>
    );
}
