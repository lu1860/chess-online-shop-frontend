import { RequireAuth } from "@/src/features/auth/components/RouteGuards";
import { AdminNav } from "@/src/features/common/components/AdminNav";
import { PageHeader } from "@/src/features/common/components/PageHeader";

/** /admin y sus subrutas: solo rol admin. Un usuario normal que escriba la URL es redirigido al inicio. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <RequireAuth roles={["admin"]}>
            <div className="pb-14">
                <PageHeader title="Administración" description="Gestiona el catálogo y revisa los pedidos de la tienda.">
                    <AdminNav />
                </PageHeader>
                <div className="mt-10">{children}</div>
            </div>
        </RequireAuth>
    );
}
