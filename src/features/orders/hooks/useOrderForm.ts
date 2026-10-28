"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { EMAIL_PATTERN, type User } from "../../auth/domain/auth";
import { ApiError, getErrorMessage, type FieldErrors } from "../../common/domain/api";
import { MAX_QUANTITY, type Order, type OrderFormValues } from "../domain/order";
import { ordersService } from "../services/orders.service";

const MIN_NAME = 3;

// Las mismas validaciones del formulario de la Entrega 1
const validate = (field: keyof OrderFormValues, value: string): string => {
    switch (field) {
        case "customerName":
            if (!value.trim()) return "El nombre es obligatorio.";
            if (value.trim().length < MIN_NAME) return `El nombre debe tener al menos ${MIN_NAME} caracteres.`;
            return "";
        case "customerEmail":
            if (!value.trim()) return "El correo electrónico es obligatorio.";
            if (!EMAIL_PATTERN.test(value.trim())) return "Escribe un correo válido, por ejemplo: nombre@correo.com";
            return "";
        case "productId":
            return value ? "" : "Selecciona el producto que quieres pedir.";
        case "quantity": {
            if (!value.trim()) return "La cantidad es obligatoria.";
            const quantity = Number(value);
            if (!Number.isInteger(quantity)) return "La cantidad debe ser un número entero.";
            if (quantity < 1) return "La cantidad mínima es 1.";
            if (quantity > MAX_QUANTITY) return `La cantidad máxima por pedido es ${MAX_QUANTITY}.`;
            return "";
        }
    }
};

const FIELDS: (keyof OrderFormValues)[] = ["customerName", "customerEmail", "productId", "quantity"];

/**
 * Formulario de pedido. Nombre y correo se precargan con los datos de la sesión.
 * selectedProductId viene de la URL (botón "Agregar al pedido" del catálogo).
 */
export function useOrderForm(user: User, selectedProductId: string) {
    const [values, setValues] = useState<OrderFormValues>({
        customerName: user.name,
        customerEmail: user.email,
        productId: selectedProductId,
        quantity: "1",
    });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
    const [isSubmitting, setSubmitting] = useState(false);
    // Si el usuario pulsa "Agregar al pedido" en otro producto, el select se actualiza
    const [lastSelected, setLastSelected] = useState(selectedProductId);
    if (selectedProductId !== lastSelected) {
        setLastSelected(selectedProductId);
        if (selectedProductId) {
            setValues((previous) => ({ ...previous, productId: selectedProductId }));
            setErrors((previous) => ({ ...previous, productId: "" }));
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const field = event.target.name as keyof OrderFormValues;
        const { value } = event.target;
        setValues((previous) => ({ ...previous, [field]: value }));
        if (errors[field]) setErrors((previous) => ({ ...previous, [field]: validate(field, value) }));
    };

    const handleBlur = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const field = event.target.name as keyof OrderFormValues;
        setErrors((previous) => ({ ...previous, [field]: validate(field, event.target.value) }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);
        setCreatedOrder(null);
        const nextErrors: FieldErrors = {};
        for (const field of FIELDS) {
            const message = validate(field, values[field]);
            if (message) nextErrors[field] = message;
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setSubmitting(true);
        try {
            const order = await ordersService.create({
                productId: Number(values.productId),
                quantity: Number(values.quantity),
                customerName: values.customerName.trim(),
                customerEmail: values.customerEmail.trim(),
            });
            setCreatedOrder(order);
            setValues((previous) => ({ ...previous, productId: "", quantity: "1" }));
        } catch (error) {
            if (error instanceof ApiError && Object.keys(error.fields).length > 0) setErrors(error.fields);
            else if (error instanceof ApiError && error.status === 404) setErrors({ productId: error.message });
            else setFormError(getErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    };

    return { values, errors, formError, createdOrder, isSubmitting, handleChange, handleBlur, handleSubmit };
}
