import type { ReactNode } from "react";

interface AlertProps {
    type: "success" | "error";
    children: ReactNode;
}

/** Mensaje de éxito o de error general (el de la Entrega 1 con borde izquierdo). */
export function Alert({ type, children }: AlertProps) {
    const styles =
        type === "success"
            ? "border-success bg-success-bg text-success"
            : "border-danger bg-[#fbeeee] text-danger";
    return (
        <div
            role={type === "error" ? "alert" : "status"}
            className={`rounded-[5px] border border-l-4 px-4 py-3.5 text-[0.95rem] leading-normal ${styles}`}
        >
            {children}
        </div>
    );
}
