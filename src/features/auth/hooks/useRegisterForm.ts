"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { ApiError, getErrorMessage, type FieldErrors } from "../../common/domain/api";
import { EMAIL_PATTERN, type RegisterFormValues } from "../domain/auth";
import { authService } from "../services/auth.service";

const MIN_NAME = 3;
const MIN_PASSWORD = 8;

// Las mismas reglas que valida la API: así el usuario se entera antes de enviar
const validate = (field: keyof RegisterFormValues, values: RegisterFormValues): string => {
    const value = values[field];
    switch (field) {
        case "name":
            if (!value.trim()) return "El nombre es obligatorio.";
            if (value.trim().length < MIN_NAME) return `El nombre debe tener al menos ${MIN_NAME} caracteres.`;
            return "";
        case "email":
            if (!value.trim()) return "El correo electrónico es obligatorio.";
            if (!EMAIL_PATTERN.test(value.trim())) return "Escribe un correo válido, por ejemplo: nombre@correo.com";
            return "";
        case "password":
            if (!value) return "La contraseña es obligatoria.";
            if (value.length < MIN_PASSWORD) return `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`;
            if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return "La contraseña debe tener al menos una letra y un número.";
            return "";
        case "confirmPassword":
            if (!value) return "Confirma tu contraseña.";
            if (value !== values.password) return "Las contraseñas no coinciden.";
            return "";
    }
};

const FIELDS: (keyof RegisterFormValues)[] = ["name", "email", "password", "confirmPassword"];

/** Estado y validación del registro. Al crear la cuenta llama a onRegistered con el correo registrado. */
export function useRegisterForm(onRegistered: (email: string) => void) {
    const [values, setValues] = useState<RegisterFormValues>({ name: "", email: "", password: "", confirmPassword: "" });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setSubmitting] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const field = event.target.name as keyof RegisterFormValues;
        const nextValues = { ...values, [field]: event.target.value };
        setValues(nextValues);
        if (errors[field]) setErrors((previous) => ({ ...previous, [field]: validate(field, nextValues) }));
    };

    const handleBlur = (event: ChangeEvent<HTMLInputElement>) => {
        const field = event.target.name as keyof RegisterFormValues;
        setErrors((previous) => ({ ...previous, [field]: validate(field, values) }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);
        const nextErrors: FieldErrors = {};
        for (const field of FIELDS) {
            const message = validate(field, values);
            if (message) nextErrors[field] = message;
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setSubmitting(true);
        try {
            const user = await authService.register({
                name: values.name.trim(),
                email: values.email.trim(),
                password: values.password,
            });
            onRegistered(user.email);
        } catch (error) {
            // 409 (correo repetido) y 400 traen { fields }: cada mensaje se pinta junto a su campo
            if (error instanceof ApiError && Object.keys(error.fields).length > 0) {
                setErrors(error.fields);
            } else {
                setFormError(getErrorMessage(error));
            }
            setSubmitting(false);
        }
    };

    return { values, errors, formError, isSubmitting, handleChange, handleBlur, handleSubmit };
}
