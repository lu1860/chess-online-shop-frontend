"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../auth/hooks/useAuth";
import { Loading } from "../../common/components/StatusViews";
import { OrderForm } from "./OrderForm";

/** Sección "pedido" de la página de inicio. Hacer un pedido requiere sesión. */
export function OrderSection() {
    const { user, isReady } = useAuth();
    const selectedProductId = useSearchParams().get("producto") ?? "";

    // Al volver del login se regresa a esta misma sección con el producto que se había elegido
    const back = `/${selectedProductId ? `?producto=${selectedProductId}` : ""}#pedido`;

    let content;
    if (!isReady) {
        content = <Loading />;
    } else if (!user) {
        content = (
            <div className="mx-auto mt-[30px] max-w-[600px] rounded-lg border border-line bg-surface p-5 text-center shadow-[0_3px_10px_rgba(59,42,32,0.08)] md:p-[30px]">
                <p className="text-ink">Para hacer un pedido necesitas una cuenta. Así podrás consultarlo después en &quot;Mis pedidos&quot;.</p>
                <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link href={`/login?next=${encodeURIComponent(back)}`} className="rounded-[5px] bg-wood-dark px-6 py-3 font-bold text-white transition-colors hover:bg-wood-hover">
                        Ingresar
                    </Link>
                    <Link href={`/registro?next=${encodeURIComponent(back)}`} className="rounded-[5px] border border-wood px-6 py-3 font-bold text-wood transition-colors hover:bg-cream">
                        Crear cuenta
                    </Link>
                </div>
            </div>
        );
    } else {
        content = <OrderForm key={user.id} user={user} selectedProductId={selectedProductId} />;
    }

    return (
        <section id="pedido" className="px-[15px] py-[45px] md:px-5 md:py-[60px]">
            <h2 className="mb-[25px] text-center text-[1.7rem] font-bold leading-tight text-wood-dark md:text-[2rem]">Haz tu pedido</h2>
            <p className="text-center text-muted">Haz tu pedido en línea fácilmente.</p>
            {content}
        </section>
    );
}
