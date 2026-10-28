import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "dark" | "outline" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    /** Mientras es true el botón muestra loadingText y no se puede volver a pulsar. */
    isLoading?: boolean;
    loadingText?: string;
}

const VARIANTS: Record<Variant, string> = {
    primary: "bg-wood text-white hover:bg-wood-hover active:bg-ink",
    dark: "bg-wood-dark text-white hover:bg-wood-hover active:bg-ink",
    outline: "border border-wood bg-surface text-wood hover:bg-cream",
    danger: "bg-danger text-white hover:bg-[#962828]",
    ghost: "bg-transparent text-muted hover:bg-cream hover:text-ink",
};

/** Botón con los colores de la tienda. */
export function Button({
    variant = "primary",
    isLoading = false,
    loadingText = "Procesando...",
    className = "",
    disabled,
    children,
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            aria-busy={isLoading || undefined}
            className={`inline-flex items-center justify-center gap-2 rounded-[5px] px-5 py-2.5 font-bold transition-[background-color,transform] duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
            {...props}
        >
            {isLoading ? loadingText : children}
        </button>
    );
}
