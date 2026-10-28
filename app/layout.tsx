import type { Metadata } from "next";
import { SessionProvider } from "@/src/features/auth/components/SessionProvider";
import { Footer } from "@/src/features/common/components/Footer";
import { Navbar } from "@/src/features/common/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "ChessOnline Shop - Tienda de Ajedrez",
        template: "%s | ChessOnline Shop",
    },
    description: "Tienda en línea de tableros, piezas, relojes y libros de ajedrez.",
};

/** Layout raíz: la sesión, la barra de navegación y el pie de página se comparten en todas las rutas. */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="es">
            <body className="flex min-h-screen flex-col bg-cream font-sans text-ink antialiased">
                <SessionProvider>
                    <Navbar />
                    <main className="mx-auto my-5 w-[90%] max-w-[1200px] flex-1">{children}</main>
                    <Footer />
                </SessionProvider>
            </body>
        </html>
    );
}
