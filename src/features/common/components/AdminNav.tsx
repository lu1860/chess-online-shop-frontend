"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
    { href: "/admin", label: "Productos" },
    { href: "/admin/pedidos", label: "Pedidos" },
];

/** Pestañas del panel de administración. */
export function AdminNav() {
    const pathname = usePathname();
    return (
        <nav aria-label="Secciones de administración" className="mt-6 flex justify-center gap-2">
            {TABS.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`rounded-[5px] px-5 py-2.5 font-bold transition-colors ${isActive ? "bg-ink text-white" : "bg-wood text-white hover:bg-wood-hover"}`}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}
