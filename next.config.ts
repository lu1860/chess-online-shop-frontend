import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Las imágenes del catálogo se pintan con <img>: pueden ser rutas del sitio (/img/...) o URLs
  // externas que escribe el administrador, así que no se restringen dominios aquí.
  poweredByHeader: false,
};

export default nextConfig;
