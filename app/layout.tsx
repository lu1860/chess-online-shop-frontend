import type { Metadata } from "next";
import "./globals.css";

// Layout provisional: en el paso 4 se reemplaza por el definitivo (sesión, navbar y footer)
export const metadata: Metadata = {
    title: "ChessOnline Shop - Tienda de Ajedrez",
    description: "Tienda en línea de tableros, piezas, relojes y libros de ajedrez.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="es">
            <body className="flex min-h-screen flex-col bg-cream font-sans text-ink antialiased">
                <main className="mx-auto my-5 w-[90%] max-w-[1200px] flex-1">{children}</main>
            </body>
        </html>
    );
}
