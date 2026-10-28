"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { ApiError, getErrorMessage, type FieldErrors } from "../../common/domain/api";
import { EMAIL_PATTERN, type LoginRequest } from "../domain/auth";
import { useAuth } from "./useAuth";

const validate = (field: keyof LoginRequest, value: string): string => {
    if (field === "email") {
        if (!value.trim()) return "El correo electrónico es obligatorio.";
        if (!EMAIL_PATTERN.test(value.trim())) return "Escribe un correo válido, por ejemplo: nombre@correo.com";
    }
    if (field === "password" && !value) return "La contraseña es obligatoria.";
    return "";
};

/**
 * Estado y validación del formulario de login.
 * Los errores (del navegador y de la API) quedan por campo para mostrarlos junto a cada input.
 * Al iniciar sesión no navega: <GuestOnly> detecta la sesión y redirige.
 */
export function useLoginForm(initialEmail = "") {
    const { login } = useAuth();
    const [values, setValues] = useState<LoginRequest>({ email: initialEmail, password: "" });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setSubmitting] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const field = event.target.name as keyof LoginRequest;
        const { value } = event.target;
        setValues((previous) => ({ ...previous, [field]: value }));
        // Mientras corrige, el error desaparece apenas el valor es válido
        if (errors[field]) setErrors((previous) => ({ ...previous, [field]: validate(field, value) }));
    };

    const handleBlur = (event: ChangeEvent<HTMLInputElement>) => {
        const field = event.target.name as keyof LoginRequest;
        setErrors((previous) => ({ ...previous, [field]: validate(field, event.target.value) }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);
        const nextErrors: FieldErrors = {
            email: validate("email", values.email),
            password: validate("password", values.password),
        };
        setErrors(nextErrors);
        if (nextErrors["email"] || nextErrors["password"]) return;

        setSubmitting(true);
        try {
            await login({ email: values.email.trim(), password: values.password });
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
                // Mensaje genérico de la API: no dice si falló el correo o la contraseña
                setErrors({ password: error.message });
            } else if (error instanceof ApiError && Object.keys(error.fields).length > 0) {
                setErrors(error.fields);
            } else {
                setFormError(getErrorMessage(error));
            }
            setSubmitting(false);
        }
    };

    return { values, errors, formError, isSubmitting, handleChange, handleBlur, handleSubmit };
}
