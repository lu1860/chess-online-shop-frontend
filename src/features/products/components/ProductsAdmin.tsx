"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Alert } from "../../common/components/Alert";
import { Button } from "../../common/components/Button";
import { ConfirmDialog } from "../../common/components/ConfirmDialog";
import { Pagination } from "../../common/components/Pagination";
import { EmptyState, ErrorState, Loading } from "../../common/components/StatusViews";
import { formatPrice } from "../../common/format";
import { usePageParam } from "../../common/hooks/usePageParam";
import { ADMIN_PAGE_SIZE, categoryLabel, type Product } from "../domain/product";
import { useProductAdmin, type ProductFormValues } from "../hooks/useProductAdmin";
import { useProducts } from "../hooks/useProducts";
import { ProductFormModal } from "./ProductFormModal";
import { ProductImage } from "./ProductImage";

type FormState = { mode: "closed" } | { mode: "create" } | { mode: "edit"; product: Product };

/** Panel de productos: listar, crear, editar y eliminar (con confirmación). */
export function ProductsAdmin() {
    const [page, setPage] = usePageParam();
    const { products, pagination, isLoading, error, reload } = useProducts({ page, limit: ADMIN_PAGE_SIZE });
    const admin = useProductAdmin(reload);
    const [form, setForm] = useState<FormState>({ mode: "closed" });
    const [toDelete, setToDelete] = useState<Product | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    const openForm = (state: FormState) => {
        admin.resetErrors();
        setNotice(null);
        setForm(state);
    };

    const handleSave = async (values: ProductFormValues) => {
        const isEdit = form.mode === "edit";
        const saved = await admin.save(values, isEdit ? form.product.id : undefined);
        if (saved) {
            setForm({ mode: "closed" });
            setNotice(isEdit ? "Producto actualizado." : "Producto creado. Ya aparece en el catálogo.");
        }
    };

    const handleDelete = async () => {
        if (!toDelete) return;
        const name = toDelete.name;
        if (await admin.remove(toDelete.id)) {
            setToDelete(null);
            setNotice(`"${name}" se eliminó del catálogo.`);
            // Si era el último de la página, se vuelve a la anterior
            if (products.length === 1 && page > 1) setPage(page - 1);
        }
    };

    let content;
    if (isLoading) content = <Loading message="Cargando productos..." />;
    else if (error) content = <ErrorState title="No se pudieron cargar los productos" message={error} onRetry={reload} />;
    else if (products.length === 0) content = <EmptyState message="El catálogo está vacío. Crea el primer producto." />;
    else
        content = (
            <ul className="mt-6 divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
                {products.map((product) => (
                    <li key={product.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                        <ProductImage product={product} className="h-24 w-full shrink-0 rounded-[5px] sm:h-16 sm:w-20" />
                        <div className="min-w-0 flex-1">
                            <p className="font-bold text-wood-dark">{product.name}</p>
                            <p className="text-sm text-muted">
                                {categoryLabel(product.category)} · <span className="font-bold text-wood">{formatPrice(product.price)}</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1 px-3 py-2 text-sm sm:flex-none" onClick={() => openForm({ mode: "edit", product })} aria-label={`Editar ${product.name}`}>
                                <Pencil className="h-4 w-4" aria-hidden="true" />
                                Editar
                            </Button>
                            <Button
                                variant="danger"
                                className="flex-1 px-3 py-2 text-sm sm:flex-none"
                                onClick={() => {
                                    admin.resetErrors();
                                    setToDelete(product);
                                }}
                                aria-label={`Eliminar ${product.name}`}
                            >
                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                                Eliminar
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        );

    return (
        <section aria-labelledby="admin-products-title">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 id="admin-products-title" className="text-[1.4rem] font-bold text-wood-dark">
                        Productos
                    </h2>
                    {!isLoading && !error && <p className="text-sm text-muted">{pagination.total} en el catálogo</p>}
                </div>
                <Button variant="dark" onClick={() => openForm({ mode: "create" })}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Nuevo producto
                </Button>
            </div>

            {notice && (
                <div className="mt-5">
                    <Alert type="success">{notice}</Alert>
                </div>
            )}

            {content}
            {!isLoading && !error && <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />}

            {form.mode !== "closed" && (
                <ProductFormModal
                    key={form.mode === "edit" ? form.product.id : "new"}
                    isOpen
                    product={form.mode === "edit" ? form.product : null}
                    isSaving={admin.isSaving}
                    errors={admin.errors}
                    actionError={admin.actionError}
                    onSubmit={handleSave}
                    onClose={() => setForm({ mode: "closed" })}
                />
            )}

            <ConfirmDialog
                isOpen={toDelete !== null}
                title="¿Eliminar este producto?"
                message={
                    <>
                        <strong className="text-ink">{toDelete?.name}</strong> dejará de aparecer en el catálogo. Los pedidos que ya lo incluyen se conservan.
                    </>
                }
                isLoading={admin.isDeleting}
                error={toDelete ? admin.actionError : null}
                onConfirm={handleDelete}
                onCancel={() => setToDelete(null)}
            />
        </section>
    );
}
