"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: ReactNode;
    confirmLabel?: string;
    isLoading?: boolean;
    error?: string | null;
    onConfirm: () => void;
    onCancel: () => void;
}

/** Confirmación antes de una acción destructiva, como eliminar un producto. */
export function ConfirmDialog({ isOpen, title, message, confirmLabel = "Eliminar", isLoading, error, onConfirm, onCancel }: ConfirmDialogProps) {
    return (
        <Modal title={title} isOpen={isOpen} onClose={isLoading ? () => undefined : onCancel}>
            <div className="text-muted">{message}</div>
            {error && <p role="alert" className="mt-4 text-danger">{error}</p>}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={onConfirm} isLoading={isLoading} loadingText="Eliminando...">
                    {confirmLabel}
                </Button>
            </div>
        </Modal>
    );
}
