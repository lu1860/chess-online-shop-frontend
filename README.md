# ChessOnline Shop - Frontend

## ¿Qué es el proyecto?

ChessOnline Shop es una tienda en línea de productos de ajedrez: tableros, piezas, relojes y libros. Este repositorio contiene la API REST que proporciona el catálogo, registra usuarios y gestiona pedidos con autenticación y permisos.

El catálogo es público y permite buscar, filtrar y paginar productos. Los usuarios registrados pueden crear pedidos y consultar los propios; los administradores también pueden gestionar el catálogo y consultar todos los pedidos.

## Repositorios y despliegues

- Repositorio del backend: [chess-online-shop-backend](https://github.com/lu1860/chess-online-shop-backend)
- API desplegada: [chess-online-shop-backend.onrender.com](https://chess-online-shop-backend.onrender.com)
- Frontend desplegado:
[chess-online-shop-frontend.vercel.app/](https://chess-online-shop-frontend.vercel.app/) 
- Repositorio del frontend: [chess-online-shop-frontend](https://github.com/lu1860/chess-online-shop-frontend.git)


## Correrlo en local

Primero levanta la API (ver el README del backend).

```bash
npm install
cp .env.example .env.local    # NEXT_PUBLIC_API_HOST=http://localhost:3001/api
npm run dev                   # http://localhost:3000
```

| Variable | Ejemplo | Para qué |
| --- | --- | --- |
| `NEXT_PUBLIC_API_HOST` | `https://TU-API.onrender.com/api` | URL base de la API, **incluye `/api`** y no lleva `/` al final |

## Credenciales de prueba

Las crea el seed del backend. Son solo para el ambiente de esta entrega.

| Rol | Correo | Contraseña |
| --- | --- | --- |
| admin | `admin@chessonline.shop` | `Admin2026!` |
| user | `cliente@chessonline.shop` | `Cliente2026!` |

## Decisiones técnicas

- La API está implementada con Express y TypeScript; el código separa las responsabilidades de aplicación, dominio, infraestructura y rutas/controladores.
- PostgreSQL almacena usuarios, productos y pedidos; Prisma gestiona el acceso a la base de datos y las migraciones.
- Las contraseñas se guardan como hashes de bcrypt, no en texto plano.
- El login entrega un JWT Bearer que identifica al usuario y su rol. Las rutas protegidas requieren el header `Authorization: Bearer <token>`.
- Los roles `user` y `admin` controlan las acciones permitidas: por ejemplo, un usuario normal puede consultar sus pedidos, mientras que solo un administrador puede modificar productos o consultar todos los pedidos.
- El catálogo de productos puede consultarse sin iniciar sesión; crear pedidos y acceder a las funciones privadas requiere autenticación.
- Los productos se eliminan de forma lógica para conservar su relación con pedidos existentes.
- CORS permite los orígenes configurados en `FRONTEND_URL`, en lugar de aceptar cualquier origen.


### Flujo completo de un login, desde el formulario hasta que una ruta protegida responde

Cuando envío el formulario, `LoginForm` delega el estado y la validación a `useLoginForm`. Si los datos son válidos, el hook llama a `login` del contexto de autenticación. `SessionProvider` usa `authService` para enviar las credenciales a `POST /auth/login`; el servicio realiza la petición mediante `apiRequest`. Si la API las acepta, devuelve el usuario y el token. El frontend guarda el JWT en la cookie `chess_token` y los datos del usuario en `localStorage`, y actualiza el estado de sesión. Entonces `GuestOnly` detecta que ya inicié sesión y me redirige a la ruta indicada en `next`, si existe, o al inicio.

Al entrar a `/mis-pedidos`, `proxy.ts` revisa que exista un token no vencido y permite continuar; esta revisión del frontend no verifica la firma del token. `RequireAuth` también comprueba la sesión en el cliente. Después, `useOrders` solicita los pedidos propios a `ordersService.getMine`, que llama a `GET /orders/mias`. `apiRequest` agrega el token en el header `Authorization: Bearer ...`, y la API valida el token y devuelve los pedidos de esa cuenta. Si responde `401`, el frontend borra la sesión y redirige al login; la API es quien aplica la autorización real.

### ¿Dónde se guarda el token y qué riesgo tiene esa decisión?

El JWT se guarda en la cookie `chess_token`. El principal riesgo es una vulnerabilidad XSS: un script malicioso ejecutado en el sitio podría leer el token y usarlo para actuar como el usuario hasta que expire o se cierre la sesión.

### ¿En qué caso la API responde 401 y en cuál 403? Un ejemplo real

- **401 (no autenticado):** Falta el token, tiene un formato incorrecto, es inválido o venció. También se devuelve si las credenciales de login no son válidas.
- **403 (sin permiso):** El token es válido, pero el rol no tiene permiso para realizar esa acción. Por ejemplo, un usuario `user` que intenta eliminar un producto.

### Uso de IA

Utilicé herramientas de inteligencia artificial como apoyo durante el desarrollo, principalmente para organizar las funcionalidades de la aplicación y pensar cómo distribuir el código y las carpetas del proyecto. También las consulté para identificar qué dependencias necesitaba instalar y para entender mejor el flujo de la aplicación, tomando como referencia el repositorio base proporcionado en clase.

Las sugerencias se contrastaron con el código del repositorio base y con las necesidades de este proyecto antes de aplicarlas. La IA fue una herramienta de consulta y apoyo; revisé las propuestas y decisiones para adaptarlas al funcionamiento de la aplicación.

## Evidencia: petición protegida en la pestaña Network

![Petición protegida con Authorization en Network](./docs/captura-network.png)
