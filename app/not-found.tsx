import Link from "next/link";

/** Página 404 propia. */
export default function NotFound() {
    return (
        <section className="px-5 py-20 text-center md:py-28">
            <span aria-hidden="true" className="block text-[5rem] leading-none text-wood-light">
                &#9818;
            </span>
            <p className="mt-4 font-bold text-wood">Error 404</p>
            <h1 className="mt-2 text-[2.2rem] font-bold leading-tight text-wood-dark md:text-[2.8rem]">Esta casilla está vacía</h1>
            <p className="mx-auto mt-4 max-w-[520px] text-[1.1rem] text-muted">
                La página que buscas no existe o cambió de lugar. Vuelve al tablero y sigue explorando el catálogo.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/" className="rounded-[5px] bg-wood-dark px-6 py-3 font-bold text-white transition-colors hover:bg-wood-hover">
                    Ir al inicio
                </Link>
                <Link href="/#catalogo" className="rounded-[5px] border border-wood px-6 py-3 font-bold text-wood transition-colors hover:bg-surface">
                    Ver el catálogo
                </Link>
            </div>
        </section>
    );
}
