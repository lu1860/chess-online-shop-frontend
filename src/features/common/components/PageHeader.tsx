import type { ReactNode } from "react";

/** Título de las páginas internas (mis pedidos, administración). */
export function PageHeader({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
    return (
        <header className="pt-10 text-center md:pt-14">
            <h1 className="text-[1.7rem] font-bold leading-tight text-wood-dark md:text-[2rem]">{title}</h1>
            <p className="mt-2 text-muted">{description}</p>
            {children}
        </header>
    );
}
