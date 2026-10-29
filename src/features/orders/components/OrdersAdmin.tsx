"use client";

import { Pagination } from "../../common/components/Pagination";
import { EmptyState, ErrorState, Loading } from "../../common/components/StatusViews";
import { formatDate, formatPrice } from "../../common/format";
import { usePageParam } from "../../common/hooks/usePageParam";
import { useOrders } from "../hooks/useOrders";
import { OrderStatusBadge } from "./OrderStatusBadge";

/** Todos los pedidos de la tienda (solo admin). */
export function OrdersAdmin() {
    const [page, setPage] = usePageParam();
    const { orders, pagination, isLoading, error, reload } = useOrders("all", page);

    let content;
    if (isLoading) content = <Loading message="Cargando pedidos..." />;
    else if (error) content = <ErrorState title="No se pudieron cargar los pedidos" message={error} onRetry={reload} />;
    else if (orders.length === 0) content = <EmptyState message="Todavía no hay pedidos." />;
    else
        content = (
            <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-surface">
                <table className="w-full min-w-[720px] text-left text-sm">
                    <caption className="sr-only">Pedidos de la tienda</caption>
                    <thead className="bg-wood-dark text-white">
                        <tr>
                            <th scope="col" className="px-4 py-3">#</th>
                            <th scope="col" className="px-4 py-3">Fecha</th>
                            <th scope="col" className="px-4 py-3">Cliente</th>
                            <th scope="col" className="px-4 py-3">Producto</th>
                            <th scope="col" className="px-4 py-3 text-right">Cant.</th>
                            <th scope="col" className="px-4 py-3 text-right">Total</th>
                            <th scope="col" className="px-4 py-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                        {orders.map((order) => (
                            <tr key={order.id} className="align-top">
                                <td className="px-4 py-3 font-bold text-wood-dark">{order.id}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(order.createdAt)}</td>
                                <td className="px-4 py-3">
                                    <span className="block font-bold text-ink">{order.customerName}</span>
                                    <span className="block text-muted">{order.customerEmail}</span>
                                    {order.user && order.user.email !== order.customerEmail && (
                                        <span className="block text-xs text-muted">Cuenta: {order.user.email}</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-ink">{order.product.name}</td>
                                <td className="px-4 py-3 text-right">{order.quantity}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-wood">{formatPrice(order.total)}</td>
                                <td className="px-4 py-3">
                                    <OrderStatusBadge status={order.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

    return (
        <section aria-labelledby="admin-orders-title">
            <h2 id="admin-orders-title" className="text-[1.4rem] font-bold text-wood-dark">
                Pedidos
            </h2>
            {!isLoading && !error && <p className="text-sm text-muted">{pagination.total} en total</p>}
            {content}
            {!isLoading && !error && <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />}
        </section>
    );
}
