/** Sección de bienvenida, con el mismo texto de la Entrega 1. */
export function HeroSection() {
    return (
        <section id="inicio" className="bg-cream px-5 py-[70px] text-center md:py-[100px]">
            <h1 className="mb-5 text-[2.2rem] font-bold leading-[1.2] text-wood-dark md:text-[2.8rem]">Bienvenido a ChessOnline Shop</h1>
            <p className="mx-auto max-w-[700px] text-[1.2rem] text-muted">
                Descubre nuestra amplia selección de piezas de ajedrez y accesorios.
            </p>
        </section>
    );
}
