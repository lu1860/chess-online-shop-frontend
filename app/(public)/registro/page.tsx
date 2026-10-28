import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/src/features/auth/components/RegisterForm";
import { GuestOnly } from "@/src/features/auth/components/RouteGuards";
import { Loading } from "@/src/features/common/components/StatusViews";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegisterPage() {
    return (
        <Suspense fallback={<Loading />}>
            <GuestOnly>
                <RegisterForm />
            </GuestOnly>
        </Suspense>
    );
}
