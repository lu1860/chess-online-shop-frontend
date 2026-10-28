import { RequireAuth } from "@/src/features/auth/components/RouteGuards";

/** Todo lo que está en app/(private) exige sesión. proxy.ts lo revisa antes en el servidor. */
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
    return <RequireAuth>{children}</RequireAuth>;
}
