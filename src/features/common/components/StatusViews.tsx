import type { ReactNode } from "react";
import { Button } from "./Button";

/** Estado "cargando": una pieza de ajedrez que respira mientras llegan los datos. */
export function Loading({ message = "Cargando..." }: { message?: string }) {
    return (
        <div role="status" className="flex flex-col items-center justify-center gap-3 py-14 text-muted">
            <span aria-hidden="true" className="animate-pulse text-5xl leading-none text-wood-light">
                &#9822;
            </span>
            <p>{message}</p>
        </div>
    );
}

/** Estado "error": explica qué pasó y permite reintentar. */
export function ErrorState({ title, message, onRetry }: { title: string; message: string; onRetry?: () => void }) {
    return (
        <div role="alert" className="mx-auto mt-9 max-w-xl rounded-lg border border-danger/40 bg-surface p-6 text-center">
            <h3 className="text-lg font-bold text-danger">{title}</h3>
            <p className="mt-2 text-muted">{message}</p>
            {onRetry && (
                <Button variant="dark" className="mt-4" onClick={onRetry}>
                    Reintentar
                </Button>
            )}
        </div>
    );
}

/** Estado "vacío": en lugar de dejar la sección en blanco, dice qué hacer. */
export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
    return (
        <div className="mt-9 text-center">
            <p className="italic text-muted">{message}</p>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
