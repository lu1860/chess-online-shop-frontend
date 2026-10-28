"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Página actual leída de la URL (?page=2) y una función para cambiarla. */
export function usePageParam(): [number, (page: number) => void] {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const raw = Number(searchParams.get("page"));
    const page = Number.isInteger(raw) && raw >= 1 ? raw : 1;

    const setPage = (next: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (next > 1) params.set("page", String(next));
        else params.delete("page");
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    };

    return [page, setPage];
}
