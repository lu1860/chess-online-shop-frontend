import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/src/features/common/components/StatusViews";
import { OrdersAdmin } from "@/src/features/orders/components/OrdersAdmin";

export const metadata: Metadata = { title: "Pedidos" };

export default function AdminOrdersPage() {
    return (
        <Suspense fallback={<Loading />}>
            <OrdersAdmin />
        </Suspense>
    );
}
