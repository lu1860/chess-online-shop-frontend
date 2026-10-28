/** 150000 → "$150.000" (separador de miles colombiano), igual que en la Entrega 1. */
export const formatPrice = (value: number): string =>
    `$${value.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

/** Fecha y hora en formato colombiano: "22 oct 2026, 7:30 p. m." */
export const formatDate = (value: string): string =>
    new Date(value).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
