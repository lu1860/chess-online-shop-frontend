import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/src/features/common/components/StatusViews";
import { ProductsAdmin } from "@/src/features/products/components/ProductsAdmin";

export const metadata: Metadata = { title: "Administración" };

export default function AdminProductsPage() {
    return (
        <Suspense fallback={<Loading />}>
            <ProductsAdmin />
        </Suspense>
    );
}
