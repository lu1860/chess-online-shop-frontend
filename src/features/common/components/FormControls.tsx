import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const controlClass = (error?: string) =>
    `w-full rounded-[5px] border bg-white px-3 py-[11px] text-base text-ink transition-[border-color,box-shadow] duration-300 hover:border-wood-light focus:border-wood focus:shadow-[0_0_0_2px_rgba(107,79,58,0.15)] focus:outline-none disabled:cursor-not-allowed disabled:bg-cream ${
        error ? "border-danger shadow-[0_0_0_2px_rgba(184,50,50,0.12)]" : "border-field"
    }`;

interface FieldProps {
    id: string;
    label: string;
    error?: string;
    hint?: string;
    children: ReactNode;
}

/** Etiqueta + control + mensaje de error debajo del campo (como en el formulario de la Entrega 1). */
function Field({ id, label, error, hint, children }: FieldProps) {
    return (
        <div className="mb-5">
            <label htmlFor={id} className="mb-[7px] block font-bold text-ink">
                {label}
            </label>
            {children}
            {hint && !error && <span className="mt-1.5 block text-sm text-muted">{hint}</span>}
            {/* aria-live: el lector de pantalla anuncia el error cuando aparece */}
            <span id={`${id}-error`} className="mt-1.5 block text-[0.9rem] text-danger empty:hidden" aria-live="polite">
                {error}
            </span>
        </div>
    );
}

interface BaseProps {
    label: string;
    error?: string;
    hint?: string;
}

export function Input({ label, error, hint, id, name, className = "", ...props }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
    const inputId = id ?? name ?? label;
    return (
        <Field id={inputId} label={label} error={error} hint={hint}>
            <input
                id={inputId}
                name={name}
                aria-invalid={error ? true : undefined}
                aria-describedby={`${inputId}-error`}
                className={`${controlClass(error)} ${className}`}
                {...props}
            />
        </Field>
    );
}

export function Select({ label, error, hint, id, name, className = "", children, ...props }: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
    const selectId = id ?? name ?? label;
    return (
        <Field id={selectId} label={label} error={error} hint={hint}>
            <select
                id={selectId}
                name={name}
                aria-invalid={error ? true : undefined}
                aria-describedby={`${selectId}-error`}
                className={`${controlClass(error)} cursor-pointer ${className}`}
                {...props}
            >
                {children}
            </select>
        </Field>
    );
}

export function Textarea({ label, error, hint, id, name, className = "", ...props }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const textareaId = id ?? name ?? label;
    return (
        <Field id={textareaId} label={label} error={error} hint={hint}>
            <textarea
                id={textareaId}
                name={name}
                aria-invalid={error ? true : undefined}
                aria-describedby={`${textareaId}-error`}
                className={`${controlClass(error)} min-h-24 resize-y ${className}`}
                {...props}
            />
        </Field>
    );
}
