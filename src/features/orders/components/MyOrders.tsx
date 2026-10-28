"use client";

import Link from "next/link";
import { Pagination } from "../../common/components/Pagination";
import { EmptyState, ErrorState, Loading } from "../../common/components/StatusViews";
import { formatDate, formatPrice } from "../../common/format";
import { usePageParam } from "../../common/hooks/usePageParam";
import { ProductImage } from "../../products/components/ProductImage";
import { useOrders } from "../hooks/useOrders";
import { OrderStatusBadge } from "./OrderStatusBadge";

/** "Mis pedidos": solo los pedidos del usuario de la sesión (la API los filtra por el token). */
export function MyOrders() {
    const [page, setPage] = usePageParam();
    const { orders, pagination, isLoading, error, reload } = useOrders("mine", page);

    if (isLoading) return <Loading message="Cargando tus pedidos..." />;
    if (error) return <ErrorState title="No pudimos cargar tus pedidos" message={error} onRetry={reload} />;
    if (orders.length === 0) {
        return (
            <EmptyState
                message="Todavía no has hecho pedidos."
                action={
                    <Link href="/#catalogo" className="inline-block rounded-[5px] bg-wood px-6 py-3 font-bold text-white transition-colors hover:bg-wood-hover">
                        Ver el catálogo
                    </Link>
                }
            />
        );
    }

    return (
        <>
            <ul className="mx-auto mt-8 max-w-[800px] space-y-4">
                {orders.map((order) => (
                    <li key={order.id} className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 sm:flex-row sm:items-center sm:p-5">
                        <ProductImage product={order.product} className="h-36 w-full shrink-0 rounded-[5px] sm:h-24 sm:w-28" />
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <h3 className="text-[1.1rem] font-bold text-wood-dark">{order.product.name}</h3>
                                <OrderStatusBadge status={order.status} />
                            </div>
                            <p className="text-sm text-muted">
                                Pedido #{order.id}, {formatDate(order.createdAt)}
                            </p>
                            <p className="mt-1 text-ink">
                                {order.quantity} × {formatPrice(order.unitPrice)}
                            </p>
                        </div>
                        <p className="text-[1.3rem] font-bold text-wood sm:text-right">{formatPrice(order.total)}</p>
                    </li>
                ))}
            </ul>
            <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </>
    );
}
