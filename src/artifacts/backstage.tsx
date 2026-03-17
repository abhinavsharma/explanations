import { ArtifactStatus } from '@/components/artifact-wrapper';

export const artifactStatus = ArtifactStatus.HIDDEN;

import { Link } from "react-router-dom";

const artifactModules = import.meta.glob(['./*.tsx', './**/*.tsx'], { eager: true });

function formatDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function formatTitle(path: string) {
  return path
    .replace(/^\//, '')
    .replace(/^blog-post\//, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Backstage() {
  const artifacts = Object.entries(artifactModules)
    .filter(([path, module]) => {
      if (path.includes('index')) return false;
      if (path.includes('backstage')) return false;
      const mod = module as any;
      return mod.artifactStatus === ArtifactStatus.UNLISTED || mod.artifactStatus === ArtifactStatus.HIDDEN;
    })
    .map(([path, module]) => {
      const mod = module as any;
      const name = path.replace('./', '').replace('.tsx', '');
      return {
        path: `/${name}`,
        status: mod.artifactStatus as ArtifactStatus,
        publishDate: mod.publishDate as string | undefined,
        title: mod.title as string | undefined,
        isBlogPost: name.startsWith('blog-post/'),
      };
    })
    .sort((a, b) => {
      if (!a.publishDate && !b.publishDate) return 0;
      if (!a.publishDate) return 1;
      if (!b.publishDate) return -1;
      return b.publishDate.localeCompare(a.publishDate);
    });

  return (
    <div className="index-page">
      <header className="index-header">
        <h1 className="index-site-title">Backstage</h1>
      </header>

      <section className="index-section">
        <h2 className="index-section-title">Unlisted & Hidden</h2>
        <ul className="index-list">
          {artifacts.map((a) => (
            <li key={a.path}>
              <Link to={a.path} className="index-interactive-link">
                <span className="index-interactive-title">
                  {a.title || formatTitle(a.path)}
                </span>
                <span className="index-interactive-date">
                  {a.status === ArtifactStatus.HIDDEN ? 'hidden' : 'unlisted'}
                  {a.publishDate ? ` · ${formatDate(a.publishDate)}` : ''}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
