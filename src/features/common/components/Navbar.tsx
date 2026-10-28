"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";

/** Secciones de la página de inicio: las mismas del menú de la Entrega 1. */
const SECTION_LINKS = [
    { href: "/#inicio", label: "Inicio" },
    { href: "/#categorias", label: "Categorías" },
    { href: "/#catalogo", label: "Catálogo" },
    { href: "/#pedido", label: "Hacer Pedido" },
];

const linkClass =
    "block rounded px-2.5 py-3.5 font-bold text-white transition-colors hover:bg-white/5 hover:text-wood-light xl:border-b-2 xl:border-transparent xl:px-0 xl:py-1 xl:hover:border-wood-light xl:hover:bg-transparent";

/**
 * Barra de navegación. Cambia según la sesión:
 *  - invitado: "Ingresar"
 *  - usuario: su nombre, "Mis pedidos" y "Salir"
 *  - admin: además "Administración"
 * Por debajo de 1280 px se convierte en menú hamburguesa (como en la Entrega 1; el punto de corte es mayor
 * porque ahora la barra también lleva las opciones de la sesión).
 */
export function Navbar() {
    const { user, isReady, isAdmin, logout } = useAuth();
    const pathname = usePathname();
    const [isOpen, setOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);

    // Escape y clic por fuera cierran el menú
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
                toggleRef.current?.focus();
            }
        };
        const onClick = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("click", onClick);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("click", onClick);
        };
    }, [isOpen]);

    const close = () => setOpen(false);

    const handleLogout = () => {
        close();
        logout();
        // Recarga completa al inicio: ninguna pantalla privada queda en memoria. Con router.push, la guardia
        // de la página privada actual alcanzaría a redirigir al login antes de llegar al inicio.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign("/");
    };

    const isCurrent = (href: string) => (pathname === href ? "page" : undefined);

    return (
        <header className="bg-wood-dark py-3.5 text-white md:py-[18px]">
            <nav ref={navRef} aria-label="Navegación principal" className="mx-auto flex w-[90%] max-w-[1200px] flex-wrap items-center justify-between gap-x-[15px] xl:gap-y-[15px]">
                <Link href="/" onClick={close} className="inline-flex items-center gap-2 text-[1.15rem] font-bold text-white transition-colors hover:text-wood-light md:text-[1.3rem]">
                    <span aria-hidden="true" className="text-[1.7rem] leading-none text-wood-light">
                        &#9822;
                    </span>
                    ChessOnline Shop
                </Link>

                <button
                    ref={toggleRef}
                    type="button"
                    onClick={() => setOpen((open) => !open)}
                    aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={isOpen}
                    aria-controls="nav-links"
                    className="group flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-[5px] border border-white/25 transition-colors hover:border-wood-light hover:bg-white/5 xl:hidden"
                >
                    <span className={`block h-0.5 w-6 rounded bg-white transition-transform duration-300 group-hover:bg-wood-light ${isOpen ? "translate-y-[7px] rotate-45" : ""}`} />
                    <span className={`block h-0.5 w-6 rounded bg-white transition-opacity duration-300 group-hover:bg-wood-light ${isOpen ? "opacity-0" : ""}`} />
                    <span className={`block h-0.5 w-6 rounded bg-white transition-transform duration-300 group-hover:bg-wood-light ${isOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
                </button>

                <div
                    id="nav-links"
                    className={`${isOpen ? "mt-3.5 flex" : "hidden"} basis-full flex-col xl:mt-0 xl:flex xl:basis-auto xl:flex-row xl:items-center xl:gap-5 2xl:gap-[35px]`}
                >
                    <ul className="flex flex-col xl:flex-row xl:items-center xl:gap-5 2xl:gap-[35px]">
                        {SECTION_LINKS.map((link) => (
                            <li key={link.href} className="border-t border-white/10 xl:border-0">
                                <Link href={link.href} onClick={close} className={linkClass}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Mientras se lee la sesión no se pinta nada, para no mostrar "Ingresar" a quien ya entró */}
                    {isReady && (
                        <ul className="flex flex-col border-t border-white/10 xl:flex-row xl:items-center xl:gap-4 xl:border-l xl:border-t-0 xl:pl-5 2xl:pl-6">
                            {user ? (
                                <>
                                    <li className="px-2.5 pt-3.5 text-sm text-white/80 xl:p-0" title={user.email}>
                                        Hola, <span className="font-bold text-white">{user.name.split(" ")[0]}</span>
                                    </li>
                                    {isAdmin && (
                                        <li>
                                            <Link href="/admin" onClick={close} aria-current={isCurrent("/admin")} className={linkClass}>
                                                Administración
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <Link href="/mis-pedidos" onClick={close} aria-current={isCurrent("/mis-pedidos")} className={linkClass}>
                                            Mis pedidos
                                        </Link>
                                    </li>
                                    <li className="py-2 xl:py-0">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full rounded-[5px] border border-white/40 px-4 py-2 font-bold text-white transition-colors hover:border-wood-light hover:text-wood-light xl:w-auto"
                                        >
                                            Salir
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li className="py-2 xl:py-0">
                                    <Link
                                        href="/login"
                                        onClick={close}
                                        className="block rounded-[5px] bg-wood-light px-5 py-2 text-center font-bold text-wood-dark transition-colors hover:bg-white"
                                    >
                                        Ingresar
                                    </Link>
                                </li>
                            )}
                        </ul>
                    )}
                </div>
            </nav>
        </header>
    );
}
