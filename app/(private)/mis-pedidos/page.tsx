import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/src/features/common/components/PageHeader";
import { Loading } from "@/src/features/common/components/StatusViews";
import { MyOrders } from "@/src/features/orders/components/MyOrders";

export const metadata: Metadata = { title: "Mis pedidos" };

export default function MyOrdersPage() {
    return (
        <div className="pb-14">
            <PageHeader title="Mis pedidos" description="Los pedidos que has hecho con tu cuenta." />
            <Suspense fallback={<Loading />}>
                <MyOrders />
            </Suspense>
        </div>
    );
}
