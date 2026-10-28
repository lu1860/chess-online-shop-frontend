"use client";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

// Siempre primera y última página, y una ventana alrededor de la actual. Los huecos se marcan con null.
const buildPageRange = (currentPage: number, totalPages: number): (number | null)[] => {
    const pages: (number | null)[] = [];
    let lastAdded = 0;
    for (let page = 1; page <= totalPages; page++) {
        const isEdge = page === 1 || page === totalPages;
        const isNearCurrent = Math.abs(page - currentPage) <= 1;
        if (!isEdge && !isNearCurrent) continue;
        if (lastAdded && page - lastAdded > 1) pages.push(null);
        pages.push(page);
        lastAdded = page;
    }
    return pages;
};

/** Paginación numerada. Quien la usa decide cómo cambia la página (en este sitio: el ?page= de la URL). */
export function Pagination({ currentPage, totalPages, onPageChange, isLoading = false }: PaginationProps) {
    if (totalPages <= 1) return null;

    const base =
        "inline-flex h-10 min-w-10 items-center justify-center rounded-[5px] border px-3 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40";
    const idle = "border-line bg-surface text-wood-dark hover:border-wood-light hover:text-wood";

    return (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Paginación">
            <button
                type="button"
                className={`${base} ${idle}`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
            >
                Anterior
            </button>
            {buildPageRange(currentPage, totalPages).map((page, index) =>
                page === null ? (
                    <span key={`gap-${index}`} className="px-1 text-muted" aria-hidden="true">
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        disabled={isLoading}
                        aria-current={page === currentPage ? "page" : undefined}
                        aria-label={`Página ${page}`}
                        className={`${base} ${page === currentPage ? "border-ink bg-ink text-white" : idle}`}
                    >
                        {page}
                    </button>
                ),
            )}
            <button
                type="button"
                className={`${base} ${idle}`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
            >
                Siguiente
            </button>
        </nav>
    );
}
