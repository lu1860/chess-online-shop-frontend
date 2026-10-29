"use client";

import { useState } from "react";
import { ApiError, getErrorMessage, type FieldErrors } from "../../common/domain/api";
import type { Product, ProductInput } from "../domain/product";
import { productsService } from "../services/products.service";

export type ProductFormValues = Omit<ProductInput, "price"> & { price: string };

export const EMPTY_PRODUCT_FORM: ProductFormValues = {
    name: "",
    category: "tableros",
    description: "",
    price: "",
    image: "",
    imageAlt: "",
};

export const toFormValues = (product: Product): ProductFormValues => ({
    name: product.name,
    category: product.category,
    description: product.description,
    price: String(product.price),
    image: product.image,
    imageAlt: product.imageAlt,
});

const IMAGE_PATTERN = /^(https?:\/\/\S+|\/\S+)$/;

// Mismas reglas que la API (ProductDto)
const validate = (values: ProductFormValues): FieldErrors => {
    const errors: FieldErrors = {};
    const name = values.name.trim();
    if (!name) errors["name"] = "El nombre es obligatorio.";
    else if (name.length < 3) errors["name"] = "El nombre debe tener al menos 3 caracteres.";
    const description = values.description.trim();
    if (!description) errors["description"] = "La descripción es obligatoria.";
    else if (description.length < 10) errors["description"] = "La descripción debe tener al menos 10 caracteres.";
    const price = Number(values.price);
    if (!values.price.trim()) errors["price"] = "El precio es obligatorio.";
    else if (!Number.isInteger(price) || price < 1) errors["price"] = "El precio debe ser un número entero mayor a 0, sin puntos ni decimales.";
    const image = values.image.trim();
    if (!image) errors["image"] = "La imagen es obligatoria.";
    else if (!IMAGE_PATTERN.test(image)) errors["image"] = "Usa una URL (https://...) o una ruta del sitio (/img/...).";
    if (values.imageAlt.trim().length < 3) errors["imageAlt"] = "Describe la imagen en al menos 3 caracteres.";
    return errors;
};

/** Crear, editar y eliminar productos desde el panel de administración. */
export function useProductAdmin(onChanged: () => void) {
    const [isSaving, setSaving] = useState(false);
    const [isDeleting, setDeleting] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [actionError, setActionError] = useState<string | null>(null);

    const resetErrors = () => {
        setErrors({});
        setActionError(null);
    };

    /** Crea (sin id) o reemplaza (con id). Devuelve true si se guardó. */
    const save = async (values: ProductFormValues, id?: number): Promise<boolean> => {
        resetErrors();
        const validation = validate(values);
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return false;
        }
        const input: ProductInput = {
            name: values.name.trim(),
            category: values.category,
            description: values.description.trim(),
            price: Number(values.price),
            image: values.image.trim(),
            imageAlt: values.imageAlt.trim(),
        };
        setSaving(true);
        try {
            if (id) await productsService.update(id, input);
            else await productsService.create(input);
            onChanged();
            return true;
        } catch (error) {
            if (error instanceof ApiError && Object.keys(error.fields).length > 0) setErrors(error.fields);
            else setActionError(getErrorMessage(error));
            return false;
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: number): Promise<boolean> => {
        setActionError(null);
        setDeleting(true);
        try {
            await productsService.remove(id);
            onChanged();
            return true;
        } catch (error) {
            setActionError(getErrorMessage(error));
            return false;
        } finally {
            setDeleting(false);
        }
    };

    return { save, remove, isSaving, isDeleting, errors, actionError, resetErrors };
}
