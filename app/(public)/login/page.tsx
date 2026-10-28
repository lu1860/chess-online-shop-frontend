import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/src/features/auth/components/LoginForm";
import { GuestOnly } from "@/src/features/auth/components/RouteGuards";
import { Loading } from "@/src/features/common/components/StatusViews";

export const metadata: Metadata = { title: "Ingresar" };

export default function LoginPage() {
    return (
        <Suspense fallback={<Loading />}>
            <GuestOnly>
                <LoginForm />
            </GuestOnly>
        </Suspense>
    );
}
