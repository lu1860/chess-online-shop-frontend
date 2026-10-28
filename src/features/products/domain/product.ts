export type ProductCategory = "tableros" | "piezas" | "relojes" | "libros";

/** Las categorías de la Entrega 1, en el mismo orden de los botones. */
export const CATEGORIES: { value: ProductCategory; label: string }[] = [
    { value: "tableros", label: "Tableros" },
    { value: "piezas", label: "Piezas" },
    { value: "relojes", label: "Relojes" },
    { value: "libros", label: "Libros" },
];

export const isCategory = (value: string | null | undefined): value is ProductCategory =>
    CATEGORIES.some((category) => category.value === value);

export const categoryLabel = (value: ProductCategory): string =>
    CATEGORIES.find((category) => category.value === value)?.label ?? value;

export interface Product {
    id: number;
    name: string;
    category: ProductCategory;
    description: string;
    /** Pesos colombianos, sin decimales. */
    price: number;
    /** Ruta del sitio (/img/...) o URL absoluta. */
    image: string;
    imageAlt: string;
    createdAt: string;
    updatedAt: string;
}

/** Lo que el administrador envía al crear o editar. */
export type ProductInput = Pick<Product, "name" | "category" | "description" | "price" | "image" | "imageAlt">;

/** Filtros combinables del catálogo (bonus): texto, categoría y rango de precio. */
export interface ProductFilters {
    q?: string;
    category?: ProductCategory;
    minPrice?: number;
    maxPrice?: number;
}

export interface ProductQuery extends ProductFilters {
    page: number;
    limit: number;
}

/** 7 productos en páginas de 6: la paginación se ve desde el primer día. */
export const CATALOG_PAGE_SIZE = 6;
export const ADMIN_PAGE_SIZE = 10;
/** Máximo que acepta la API por página; se usa para llenar el <select> del pedido. */
export const MAX_PAGE_SIZE = 50;
