"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Alert } from "../../common/components/Alert";
import { Button } from "../../common/components/Button";
import { Input, Select, Textarea } from "../../common/components/FormControls";
import { Modal } from "../../common/components/Modal";
import type { FieldErrors } from "../../common/domain/api";
import { CATEGORIES, type Product, type ProductCategory } from "../domain/product";
import { EMPTY_PRODUCT_FORM, toFormValues, type ProductFormValues } from "../hooks/useProductAdmin";
import { ProductImage } from "./ProductImage";

interface ProductFormModalProps {
    isOpen: boolean;
    /** null = crear; un producto = editarlo. */
    product: Product | null;
    isSaving: boolean;
    errors: FieldErrors;
    actionError: string | null;
    onSubmit: (values: ProductFormValues) => void;
    onClose: () => void;
}

const isPreviewable = (value: string) => /^(https?:\/\/\S+|\/\S+)$/.test(value.trim());

/** Formulario de crear/editar producto. Se monta con una key distinta por producto para reiniciar sus valores. */
export function ProductFormModal({ isOpen, product, isSaving, errors, actionError, onSubmit, onClose }: ProductFormModalProps) {
    const [values, setValues] = useState<ProductFormValues>(product ? toFormValues(product) : EMPTY_PRODUCT_FORM);

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setValues((previous) => ({ ...previous, [name]: name === "category" ? (value as ProductCategory) : value }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(values);
    };

    return (
        <Modal title={product ? `Editar: ${product.name}` : "Nuevo producto"} isOpen={isOpen} onClose={isSaving ? () => undefined : onClose}>
            {actionError && (
                <div className="mb-5">
                    <Alert type="error">{actionError}</Alert>
                </div>
            )}
            <form onSubmit={handleSubmit} noValidate>
                <Input label="Nombre" name="name" id="product-name" value={values.name} onChange={handleChange} error={errors["name"]} maxLength={150} />
                <div className="grid gap-x-4 sm:grid-cols-2">
                    <Select label="Categoría" name="category" id="product-category" value={values.category} onChange={handleChange} error={errors["category"]}>
                        {CATEGORIES.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </Select>
                    <Input
                        label="Precio (COP)"
                        name="price"
                        id="product-price"
                        inputMode="numeric"
                        placeholder="150000"
                        value={values.price}
                        onChange={handleChange}
                        error={errors["price"]}
                    />
                </div>
                <Textarea label="Descripción" name="description" id="product-description" value={values.description} onChange={handleChange} error={errors["description"]} maxLength={1000} />
                <Input
                    label="Imagen"
                    name="image"
                    id="product-image"
                    placeholder="/img/tablero-madera.jpg o https://..."
                    hint="Ruta de una imagen del sitio (/img/...) o una URL https."
                    value={values.image}
                    onChange={handleChange}
                    error={errors["image"]}
                    maxLength={500}
                />
                {isPreviewable(values.image) && (
                    <ProductImage product={{ image: values.image.trim(), imageAlt: "Vista previa de la imagen" }} className="mb-5 h-40 rounded-[5px] border border-line" />
                )}
                <Input
                    label="Texto alternativo de la imagen"
                    name="imageAlt"
                    id="product-image-alt"
                    hint="Describe la imagen para quien usa lector de pantalla."
                    value={values.imageAlt}
                    onChange={handleChange}
                    error={errors["imageAlt"]}
                    maxLength={255}
                />
                <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button variant="ghost" onClick={onClose} disabled={isSaving}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="dark" isLoading={isSaving} loadingText="Guardando...">
                        {product ? "Guardar cambios" : "Crear producto"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
