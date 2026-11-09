# WoW API — Explorador de Personajes

Aplicación web para explorar personajes de World of Warcraft. Muestra una lista de
personajes con filtros, ordenación y una vista de detalle con profesiones, equipo y
reputaciones.

## Stack

- React 19
- Vite 6
- JavaScript (ES6+)
- CSS plano (mobile-first, dark mode)
- React Router DOM
- Firebase (Firestore)

## Estructura

```text
src/
├── components/     # Componentes reutilizables (filtros, barras de progreso, etc.)
├── pages/          # Páginas (lista de personajes y detalle)
├── hooks/          # Hooks personalizados (useCountUp)
├── lib/            # Configuración de Firebase
├── assets/         # Imágenes (logos de Horda y Alianza)
├── n8n-workflow/   # Workflows de n8n
└── index.css       # Tokens de diseño y estilos globales (variables CSS)
```

## Diseño

La paleta usa tonos neutros (grises cálidos sobre fondo oscuro) con detalles de color
por facción: rojo para la Horda y azul para la Alianza. Incluye cabecera y pie de página.

## Desarrollo

```bash
pnpm install
pnpm dev
```

Para generar una build de producción:

```bash
pnpm build
```

## Configuración

Crea un archivo `.env` con las credenciales de Firebase (ver `.env.example`).
