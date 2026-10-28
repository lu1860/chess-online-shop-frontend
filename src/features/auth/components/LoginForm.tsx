"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Alert } from "../../common/components/Alert";
import { Button } from "../../common/components/Button";
import { Input } from "../../common/components/FormControls";
import { useLoginForm } from "../hooks/useLoginForm";
import { AuthCard } from "./AuthCard";

export function LoginForm() {
    const params = useSearchParams();
    const form = useLoginForm(params.get("email") ?? "");
    const next = params.get("next");
    const registerHref = next ? `/registro?next=${encodeURIComponent(next)}` : "/registro";

    return (
        <AuthCard title="Ingresar" subtitle="Inicia sesión para hacer y consultar tus pedidos.">
            <div className="mb-5 space-y-3 empty:hidden">
                {params.get("registrado") && <Alert type="success">Tu cuenta quedó creada. Ahora inicia sesión.</Alert>}
                {params.get("expirada") && <Alert type="error">Tu sesión expiró o ya no es válida. Inicia sesión de nuevo.</Alert>}
                {form.formError && <Alert type="error">{form.formError}</Alert>}
            </div>

            <form onSubmit={form.handleSubmit} noValidate>
                <Input
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.values.email}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    error={form.errors["email"]}
                />
                <Input
                    label="Contraseña"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={form.values.password}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    error={form.errors["password"]}
                />
                <Button type="submit" variant="dark" className="w-full py-[13px]" isLoading={form.isSubmitting} loadingText="Ingresando...">
                    Ingresar
                </Button>
            </form>

            <p className="mt-6 text-center text-muted">
                ¿No tienes cuenta?{" "}
                <Link href={registerHref} className="font-bold text-wood underline-offset-4 hover:underline">
                    Crea una
                </Link>
            </p>
        </AuthCard>
    );
}
