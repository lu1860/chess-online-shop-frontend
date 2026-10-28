import type { ReactNode } from "react";

/** Contenedor de los formularios de login y registro, con el mismo aspecto del formulario de pedido. */
export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
    return (
        <section className="px-5 py-14 sm:py-16">
            <div className="text-center">
                <span aria-hidden="true" className="text-5xl leading-none text-wood-light">
                    &#9822;
                </span>
                <h1 className="mt-2 text-[1.7rem] font-bold leading-tight text-wood-dark sm:text-[2rem]">{title}</h1>
                <p className="mt-2 text-muted">{subtitle}</p>
            </div>
            <div className="mx-auto mt-8 max-w-[480px] rounded-lg border border-line bg-surface p-5 shadow-[0_3px_10px_rgba(59,42,32,0.08)] sm:p-[30px]">
                {children}
            </div>
        </section>
    );
}
