"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

/** Ventana modal accesible: se cierra con Escape o con el botón, y bloquea el scroll de la página. */
export function Modal({ title, isOpen, onClose, children }: ModalProps) {
    const titleId = useId();
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const previousFocus = document.activeElement as HTMLElement | null;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        panelRef.current?.focus();
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus();
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-wood-dark/60 p-0 sm:items-center sm:p-4" onMouseDown={onClose}>
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                onMouseDown={(event) => event.stopPropagation()}
                className="max-h-[92vh] w-full overflow-y-auto rounded-t-lg bg-surface p-6 shadow-[0_8px_20px_rgba(59,42,32,0.25)] outline-none sm:max-w-xl sm:rounded-lg"
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <h2 id={titleId} className="text-xl font-bold text-wood-dark">
                        {title}
                    </h2>
                    <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded p-1 text-muted hover:bg-cream hover:text-ink">
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
