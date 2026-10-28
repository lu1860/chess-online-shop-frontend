/**
 * URL base de la API. Se lee de NEXT_PUBLIC_API_HOST (en local: .env.local; en producción: variables de Vercel).
 * Next.js reemplaza process.env.NEXT_PUBLIC_* en el build, por eso se escribe con punto y no con corchetes.
 */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001/api").replace(/\/+$/, "");
