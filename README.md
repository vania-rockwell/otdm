# Data Configuration Hub

React + TypeScript + Vite

---

## Getting Started

```bash
npm install        # install dependencies
npm run dev        # start the dev server (Vite)
npm run build      # type-check with tsc then bundle for production
npm run preview    # preview the production build locally
npm run lint       # run ESLint across the project
```

---

## Best Practices

### Developer Workflow

- Start by locating the feature folder in `src/features/*` and review related shared components in `src/components/*`.
- Keep route work synchronized across `src/router.tsx`, `src/features/layout/menu.json`, and `src/locales/*/pages.json`.
- Keep API calls in `src/services/*` and route all HTTP traffic through `src/services/internalRouter.ts`.
- Reuse design tokens and shared components instead of introducing one-off styles or duplicated UI logic.
- Before opening a PR, run `npm run lint` and `npm run build` and resolve all reported issues.

### Styles

| Layer | Location | Purpose |
|---|---|---|
| **Global tokens & resets** | `src/styles/index.css` | CSS custom properties for spacing, sizing, radii, fonts. Tailwind entry point and base layer resets. |
| **Theme colors** | `src/styles/themes/*.css` | One file per theme. Declares `--color-*` tokens scoped to `[data-theme][data-mode]`. |
| **Feature styles** | `src/features/*/*.scss` | Layout/shell styles that are specific to a feature domain (e.g. header, sidebar). |
| **Component styles** | `src/components/*/*.scss` | Co-located SCSS file next to each component. Scoped to that component only. |

**Rules**

- Use Tailwind v4 via `@import "tailwindcss"` in `src/styles/index.css`. Do not use the legacy `@tailwind` directives.
- **Never hard-code colors.** Always reference `--color-*` variables so themes and light/dark modes apply automatically.
- Use `--space-*`, `--size-control-*`, and `--radius-*` tokens for spacing, control heights, and border radii instead of arbitrary values.
- Follow **BEM naming** for CSS classes: `.block`, `.block__element`, `.block--modifier`.
- Use Sass nesting (`&__element`, `&--modifier`, `&:hover`) to keep selectors flat and readable. Limit nesting to two levels maximum.
- Each reusable component gets its own `.scss` file imported at the top of the component. Pages should **not** have their own CSS unless they have truly unique layout needs — prefer styling through shared components.

### Theming

- `src/features/theme/ThemeProvider.tsx` exposes `useTheme()` which provides `theme`, `mode`, `setTheme`, and `setMode`.
- Themes are activated by setting `data-theme` and `data-mode` attributes on `<html>`.
- To add a new theme, create a new file in `src/styles/themes/` following the existing pattern (all `--color-*` variables using space-separated RGB channels, e.g. `255 255 255`).
- Never use hex or `rgb()` directly in theme files. Always use the raw RGB channel format so the `rgb(var(--color-*) / <alpha>)` pattern works.

---

### Folder Structure

```
src/
├── components/          # Reusable UI components (Button, Select, Modal, etc.)
│   └── ComponentName/
│       ├── ComponentName.tsx
│       └── ComponentName.scss
├── features/            # Feature-specific modules (self-contained domains)
│   ├── layout/          # App shell: header, sidebar, layout grid
│   │   ├── AppShell.tsx
│   │   ├── AppHeader.tsx
│   │   ├── AppSidebar.tsx
│   │   ├── layout.config.ts
│   │   └── layout.scss
│   └── theme/           # Theme context provider
│       └── ThemeProvider.tsx
│   └── {feature}/       # Route UIs live next to domain code (see router imports)
├── locales/             # i18n namespaces (one JSON file per domain per language)
│   ├── en/
│   │   ├── common.json
│   │   └── pages.json
│   ├── es/
│   │   ├── common.json
│   │   └── pages.json
│   └── i18n.ts
├── services/            # API clients and external service integrations
├── utils/               # Pure helper/utility functions
├── assets/              # Static files (images, fonts, icons)
├── styles/              # Global CSS: tokens, resets, theme declarations
│   ├── index.css
│   └── themes/
│       ├── kalypso.css
│       └── thermofisher.css
├── App.tsx              # Root component (renders AppShell)
├── router.tsx           # Route definitions (react-router-dom)
├── main.tsx             # Application entry point
└── ThemeProvider.tsx     # Re-export for backward compatibility
```

**Placement guidelines**

| What you're building | Where it goes |
|---|---|
| Reusable across pages (Button, Table, Modal) | `src/components/ComponentName/` |
| Domain-specific logic + UI (auth, layout, theme) | `src/features/featureName/` |
| A routed screen for a domain | `src/features/{featureName}/` |
| Shared utility / helper | `src/utils/` |
| API integration | `src/services/` |

---

### API Internal Router

- API calls must go through `src/services/internalRouter.ts`.
- Do not call `fetch` directly from pages or UI components.
- Use feature/domain service functions that wrap internal router methods (`get`, `post`, `put`, `patch`, `delete`).
- Keep endpoint strings inside service layer files (`src/services/*`) so API URLs are not spread across UI code.
- Authentication headers and common request behavior should be handled centrally by the internal router.
- Base URL must be read from `VITE_API_URL` (fallback to `/api`) to support environment-specific backends.

**Example**

```ts
import { router } from "@/services/internalRouter";

export async function getCatalogs() {
	const response = await router.get("/catalogs");
	if (response.error) {
		throw new Error(response.error);
	}
	return response.data;
}
```

---

### Router

- All routes are defined in `src/router.tsx` using `createBrowserRouter` from `react-router-dom`.
- The root route renders `<App />`, which renders the persistent shell (header + sidebar). Child routes render inside `<Outlet />` in the main content area.
- To add a new route: add a component under `src/features/{feature}/`, register strings under `locales/*/pages.json`, import it in `router.tsx`, and add a `{ path, element }` entry under the root `children` array.
- Also add a matching entry in `src/features/layout/layout.config.ts` so the sidebar navigation stays in sync.

---

### Locales

- Internationalization uses `i18next` + `react-i18next`.
- Configuration is in `src/locales/i18n.ts`. Default language is `en` with `es` as fallback. The active locale is persisted under the `dch.locale` key in `localStorage`.
- **Namespaces** keep translations scalable: bundle keys by concern, lazy-load later if needed.

| Namespace | JSON | Typical keys |
|-----------|------|---------------|
| `common` | `common.json` | Shared labels, buttons, aria text, theme/language option labels (`actions.*`, `aria.*`, `fields.*`). |
| `pages` | `pages.json` | Screen copy grouped by route: `dashboard.title`, `catalogs.body`, etc. Mirror feature folder naming where it helps (`assetConfiguration`, `notFound`). |

- In components: `useTranslation("pages")`, or `useTranslation("common")`, then dot keys (`t("dashboard.title")`).
- **`document.documentElement.lang`** and **`document.title`** are synced when the locale or translations change (via `brand.appName` in `layout`).
- To add a language: duplicate `src/locales/en/*.json` into `src/locales/{lang}/`, import those files in `i18n.ts`, and extend the `resources` map and language selector options in Application settings (`common.languageOption`).
- Avoid hard-coded user-facing strings outside tests and Storybook stubs.

---

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files & directories | PascalCase for components/pages, camelCase for utilities/configs | `Button.tsx`, `layout.config.ts` |
| React components | PascalCase | `AppHeader`, `PageSection` |
| TypeScript types & interfaces | PascalCase | `ButtonProps`, `NavItem` |
| JavaScript variables & functions | camelCase | `sidebarCollapsed`, `setTheme` |
| CSS class names | BEM (block__element--modifier) | `.sidebar-link__icon`, `.btn--primary` |
| CSS custom properties | Kebab-case with category prefix | `--color-primary`, `--space-4`, `--radius-md` |

---

### Components

- Every component lives in its own folder: `src/components/ComponentName/`.
- Each folder contains at minimum `ComponentName.tsx` and `ComponentName.scss`.
- Components should be typed with explicit prop types or interfaces.
- Use `React.forwardRef` when the component wraps a native element that consumers may need to ref (e.g. `Button`, `Select`).
- Prefer composition over configuration: pass `children` or render-prop slots rather than deeply nested option objects.
- Provide sensible defaults for optional props (`variant = "primary"`, `size = "md"`).

### Icons

- Use `lucide-react` for all UI icons.
- Do not introduce other icon packs (e.g. Heroicons, Font Awesome, Material Icons) unless explicitly requested.
- Import icons by name from `lucide-react` and render them as React components.
- Keep icon presentation controlled by CSS tokens (`currentColor`, `--color-*`) so icons follow the active theme.
- For icon-only interactive controls, always provide an accessible label (`aria-label`) on the button/link.

---

### General Coding Practices

- **TypeScript strict mode.** All parameters, return types, and props must be explicitly typed. Avoid `any`.
- **Document every exported function** with a brief description of what it does, its parameters, and its return value.
- **No unused imports or variables.** The TypeScript compiler enforces `noUnusedLocals` and `noUnusedParameters`.
- **Keep components small.** If a component exceeds ~150 lines, look for extraction opportunities into sub-components or hooks.
- **Separate concerns.** Business logic belongs in hooks or services, not in JSX. Components should focus on rendering.
- **Accessibility.** Use semantic HTML elements, provide `aria-label` for icon-only buttons, and ensure interactive elements are keyboard-navigable.
- **Run `npm run build` before pushing.** The build script type-checks first (`tsc -b`), then bundles. Both must pass.
