"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "../../common/components/Alert";
import { Button } from "../../common/components/Button";
import { Input } from "../../common/components/FormControls";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { AuthCard } from "./AuthCard";

export function RegisterForm() {
    const router = useRouter();
    const next = useSearchParams().get("next");

    // Al crear la cuenta se va al login con el correo ya escrito (y el ?next= que traía)
    const form = useRegisterForm((email) => {
        const query = new URLSearchParams({ registrado: "1", email });
        if (next) query.set("next", next);
        router.push(`/login?${query.toString()}`);
    });

    return (
        <AuthCard title="Crear cuenta" subtitle="Regístrate para hacer pedidos y seguirlos desde tu cuenta.">
            {form.formError && (
                <div className="mb-5">
                    <Alert type="error">{form.formError}</Alert>
                </div>
            )}

            <form onSubmit={form.handleSubmit} noValidate>
                <Input
                    label="Nombre completo"
                    name="name"
                    autoComplete="name"
                    value={form.values.name}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    error={form.errors["name"]}
                />
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
                    autoComplete="new-password"
                    hint="Mínimo 8 caracteres, con al menos una letra y un número."
                    value={form.values.password}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    error={form.errors["password"]}
                />
                <Input
                    label="Confirmar contraseña"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={form.values.confirmPassword}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    error={form.errors["confirmPassword"]}
                />
                <Button type="submit" variant="dark" className="w-full py-[13px]" isLoading={form.isSubmitting} loadingText="Creando cuenta...">
                    Crear cuenta
                </Button>
            </form>

            <p className="mt-6 text-center text-muted">
                ¿Ya tienes cuenta?{" "}
                <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="font-bold text-wood underline-offset-4 hover:underline">
                    Ingresa
                </Link>
            </p>
        </AuthCard>
    );
}
