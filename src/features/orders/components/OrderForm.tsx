"use client";

import Link from "next/link";
import type { User } from "../../auth/domain/auth";
import { Alert } from "../../common/components/Alert";
import { Button } from "../../common/components/Button";
import { Input, Select } from "../../common/components/FormControls";
import { formatPrice } from "../../common/format";
import { useProductOptions } from "../../products/hooks/useProductOptions";
import { MAX_QUANTITY } from "../domain/order";
import { useOrderForm } from "../hooks/useOrderForm";

/** El formulario de la Entrega 1, que ahora guarda el pedido en la base de datos a través de la API. */
export function OrderForm({ user, selectedProductId }: { user: User; selectedProductId: string }) {
    const form = useOrderForm(user, selectedProductId);
    const { options, isLoading: isLoadingOptions, error: optionsError } = useProductOptions();

    const selected = options.find((product) => String(product.id) === form.values.productId);
    const quantity = Number(form.values.quantity);
    const estimatedTotal = selected && Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_QUANTITY ? selected.price * quantity : null;

    return (
        <form
            onSubmit={form.handleSubmit}
            noValidate
            className="mx-auto mt-[30px] max-w-[600px] rounded-lg border border-line bg-surface p-5 shadow-[0_3px_10px_rgba(59,42,32,0.08)] md:p-[30px]"
        >
            <Input
                label="Nombre Completo:"
                name="customerName"
                id="nombre"
                autoComplete="name"
                value={form.values.customerName}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors["customerName"]}
            />
            <Input
                label="Correo Electrónico:"
                name="customerEmail"
                id="email"
                type="email"
                autoComplete="email"
                value={form.values.customerEmail}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors["customerEmail"]}
            />
            <Select
                label="Producto:"
                name="productId"
                id="producto"
                value={form.values.productId}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                disabled={isLoadingOptions}
                error={form.errors["productId"] || optionsError || undefined}
            >
                <option value="">{isLoadingOptions ? "Cargando productos..." : "Selecciona un producto"}</option>
                {options.map((product) => (
                    <option key={product.id} value={product.id}>
                        {product.name} - {formatPrice(product.price)}
                    </option>
                ))}
            </Select>
            <Input
                label="Cantidad:"
                name="quantity"
                id="cantidad"
                type="number"
                min={1}
                max={MAX_QUANTITY}
                value={form.values.quantity}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors["quantity"]}
            />

            {estimatedTotal !== null && (
                <p className="mb-5 flex justify-between border-t border-line pt-4 text-ink">
                    <span>Total estimado</span>
                    <span className="text-[1.2rem] font-bold text-wood">{formatPrice(estimatedTotal)}</span>
                </p>
            )}

            <Button type="submit" variant="dark" className="w-full py-[13px]" isLoading={form.isSubmitting} loadingText="Registrando pedido...">
                Hacer Pedido
            </Button>

            <div aria-live="polite" className="mt-5 empty:hidden">
                {form.createdOrder && (
                    <Alert type="success">
                        Pedido #{form.createdOrder.id} registrado: {form.createdOrder.quantity} × {form.createdOrder.product.name} por{" "}
                        <strong>{formatPrice(form.createdOrder.total)}</strong>.{" "}
                        <Link href="/mis-pedidos" className="font-bold underline underline-offset-4">
                            Ver mis pedidos
                        </Link>
                    </Alert>
                )}
                {form.formError && <Alert type="error">{form.formError}</Alert>}
            </div>
        </form>
    );
}
