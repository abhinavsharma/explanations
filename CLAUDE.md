# CLAUDE.md

## What this project is

A personal site hosting interactive artifacts (demos, visualizations) and blog posts (essays with embedded interactive components). Built with Vite + React + TypeScript, deployed on Vercel.

## Typical workflow

The user drops in raw `.jsx` files from Claude artifacts (usually from ~/Downloads) and asks to convert them to fit the project. This involves adding required exports, adapting dark mode, and matching the existing styling conventions.

## Project structure

```
src/artifacts/              # General artifacts (interactive demos) — type: "general"
src/artifacts/blog-post/    # Blog post essays — type: "blog-post"
src/artifacts/og/           # OG preview card pages (hidden, for social sharing screenshots)
src/artifacts/index.tsx     # Homepage
src/artifacts/backstage.tsx # Hidden index of unlisted/hidden artifacts
src/components/             # Layout, wrapper, theme provider
plugins/                    # Vite build plugins (OG HTML generation)
```

Artifact type is determined by folder, not by any export. Anything in `blog-post/` is a blog post; everything else is general.

## Required exports for every artifact

Every `.tsx` file in `src/artifacts/` **must** export at the top, before any other imports:

```typescript
import { ArtifactStatus } from '@/components/artifact-wrapper';

export const artifactStatus = ArtifactStatus.PUBLISHED; // see statuses below
export const publishDate = "YYYY-MM-DD";
```

Blog posts should also export:
```typescript
export const title = "The post title";
export const subtitle = "A one-line description.";
```

These are used by the homepage, backstage page, and the OG HTML build plugin.

## Artifact statuses

| Status | On homepage? | WIP banner? | On backstage? |
|--------|-------------|-------------|---------------|
| `PUBLISHED` | Yes | No | No |
| `UNPUBLISHED` | Yes | Yes | No |
| `UNLISTED` | No | Yes ("Unlisted") | Yes |
| `HIDDEN` | No | No | Yes |

## Converting a raw JSX artifact to a blog post

When the user drops a `.jsx` file and says to add it as a blog post:

1. **Create the file** at `src/artifacts/blog-post/[slug].tsx`
2. **Add the header** with artifact imports and exports (status, date, title, subtitle) at the very top, before the file's own imports
3. **Dark mode**: Replace `@media (prefers-color-scheme: dark)` with `.dark { ... }` — the site uses a class-based toggle on `<html>`, not the media query. If the artifact uses JS-based dark mode detection (`useState` + toggle button), replace it with a MutationObserver on `document.documentElement`:
   ```typescript
   const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
   useEffect(() => {
     const observer = new MutationObserver(() => {
       setDark(document.documentElement.classList.contains('dark'));
     });
     observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
     return () => observer.disconnect();
   }, []);
   ```
   For canvas-based components that read CSS custom properties, replace `matchMedia('prefers-color-scheme')` listeners with the same MutationObserver pattern.
4. **Remove the artifact's own dark mode toggle button** — the site has a global one
5. **Remove `background` and `minHeight: "100vh"`** from the post's root container — the wrapper handles this
6. **Typography**: Blog post headings use these defaults from CSS (artifacts can override inline):
   - `h1`: Newsreader serif (for article titles)
   - `h2`–`h6`: JetBrains Mono, 14px, uppercase, 600 weight, 0.06em tracking
7. **Fix TypeScript issues**: Add `as const` to inline `textTransform: "uppercase"`, type style objects as `Record<string, any>`, add `React.CSSProperties` return types to style functions
8. **Fonts**: The site globally imports Newsreader and JetBrains Mono. If the artifact imports these via its own `<style>` tag, that's fine (duplicates are harmless).

## Converting a raw JSX artifact to a general artifact

Simpler — just add the header exports and ensure the default export is the component. General artifacts control their own full layout. Dark mode adaptation is still needed if the artifact has its own toggle.

## Reference blog post style

The intelligence-commoditization post is the reference style. Key patterns:
- Uses JS theme objects (`THEMES.light` / `THEMES.dark`) with a `ThemeCtx` context
- Section headers: mono font, uppercase, with a number prefix (`01`, `02`, etc.)
- Body text: serif font, 17px, 1.7 line height
- Max width: 720px, centered
- Cards: `cardBg` background, 1px border, 8px radius
- Callouts: neutral `cardBg` background, subtle left border

## Open Graph previews

Every published blog post needs an OG preview page for social sharing. The preview is based on the **first interactive diagram or visual** in the blog post, rendered as a static card.

### How it works

1. **Build plugin** (`plugins/og-html.ts`): At build time, scans `src/artifacts/blog-post/` and generates per-route HTML files (`dist/blog-post/[slug]/index.html`) with OG meta tags baked in — `og:title`, `og:description`, `og:url`, `og:image`, `twitter:card`, `twitter:image`, `article:published_time`. These tags are extracted from the blog post's `title`, `subtitle`, and `publishDate` exports via regex.

2. **OG preview pages** (`src/artifacts/og/[slug].tsx`): Each blog post has a matching OG card page that renders a static 1200x630 card. Layout is always: left side = title + subtitle, right side = simplified static version of the post's first diagram/chart/visual. These pages are `HIDDEN` status (accessible via direct URL, not listed anywhere).

3. **Dynamic meta tags**: `layout.tsx` also sets OG meta tags via `useEffect` for SPA navigation (covers Slack, Discord, iMessage which render JS).

### When adding a new blog post

After creating the blog post file, also create its OG preview:

1. Create `src/artifacts/og/[slug].tsx`
2. Set `artifactStatus = ArtifactStatus.HIDDEN`
3. Render a 1200x630 card with:
   - Hard-coded light-mode colors (`#FAFAF7` background, `#1a1a1a` text)
   - Left: post title (Newsreader serif) + subtitle (JetBrains Mono)
   - Right: static version of the first diagram/visual from the post — simplify to remove interactivity, hover states, and animation
4. The build plugin automatically picks up `og:image` pointing to `https://explanations.app/og/[slug].html`

Note: `og:image` currently points to the HTML preview pages. Most social platforms need raster images (PNG/JPEG). For full support, screenshots of the `/og/[slug]` pages would need to be generated and hosted as static assets.

## Build & deploy

```bash
npm run build    # TypeScript check + Vite build + OG HTML generation
npm run dev      # Dev server at localhost:5173
```

Deployed on Vercel with SPA rewrites. The build plugin generates static HTML files at `dist/blog-post/[slug]/index.html` with OG tags — Vercel serves these before the SPA fallback.

## Domain

The site is at `explanations.app`. OG URLs use this domain.
