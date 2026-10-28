import { STATUS_LABELS, type OrderStatus } from "../domain/order";

const STYLES: Record<OrderStatus, string> = {
    PENDIENTE: "bg-[#f6ecd9] text-wood-dark",
    CONFIRMADO: "bg-success-bg text-success",
    ENVIADO: "bg-[#e7eef6] text-[#2c4a6b]",
    CANCELADO: "bg-[#fbeeee] text-danger",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
    return <span className={`inline-block rounded-full px-3 py-0.5 text-sm font-bold ${STYLES[status]}`}>{STATUS_LABELS[status]}</span>;
}
