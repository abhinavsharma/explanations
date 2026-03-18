import { Plugin } from 'vite';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Vite plugin that generates per-route HTML files for blog posts
 * with Open Graph meta tags baked in, so social crawlers see them.
 */
export default function ogHtml(): Plugin {
  return {
    name: 'og-html',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve('dist');
      const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
      const blogPostDir = path.resolve('src/artifacts/blog');

      if (!fs.existsSync(blogPostDir)) return;

      const files = fs.readdirSync(blogPostDir).filter(f => f.endsWith('.tsx'));

      for (const file of files) {
        const slug = file.replace('.tsx', '');
        const content = fs.readFileSync(path.join(blogPostDir, file), 'utf-8');

        // Extract exports via regex — match opening quote and close on same quote type
        const titleMatch = content.match(/export\s+const\s+title\s*=\s*"([^"]+)"/) ||
                           content.match(/export\s+const\s+title\s*=\s*'([^']+)'/);
        const subtitleMatch = content.match(/export\s+const\s+subtitle\s*=[\s\n]*"([^"]+)"/) ||
                              content.match(/export\s+const\s+subtitle\s*=[\s\n]*'([^']+)'/);
        const dateMatch = content.match(/export\s+const\s+publishDate\s*=\s*"([^"]+)"/);

        const title = titleMatch?.[1] || slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
        const subtitle = subtitleMatch?.[1] || '';
        const date = dateMatch?.[1] || '';
        const url = `https://explanations.app/blog/${slug}`;
        const ogImageUrl = `https://explanations.app/og/${slug}.html`;

        const ogTags = `
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(subtitle)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(subtitle)}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    ${date ? `<meta property="article:published_time" content="${date}" />` : ''}
    <title>${escapeHtml(title)}</title>`;

        const modifiedHtml = indexHtml.replace(
          '<title>Artifact Viewer</title>',
          ogTags
        );

        // Write to dist/blog/[slug]/index.html
        const outDir = path.join(distDir, 'blog', slug);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'index.html'), modifiedHtml);
      }

      console.log(`[og-html] Generated OG HTML for ${files.length} blog posts`);
    }
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
