import { Link } from "react-router-dom";
import { ArtifactStatus } from '@/components/artifact-wrapper';

const artifactModules = import.meta.glob(['./*.tsx', './**/*.tsx'], { eager: true });

function formatDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function formatTitle(path: string) {
  return path
    .replace(/^\//, '')
    .replace(/^blog\//, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

type ArtifactEntry = {
  path: string;
  status: ArtifactStatus;
  publishDate?: string;
  title?: string;
  subtitle?: string;
  isBlogPost: boolean;
};

function getArtifacts(): ArtifactEntry[] {
  return Object.entries(artifactModules)
    .filter(([path]) => !path.includes('index'))
    .map(([path, module]) => {
      const mod = module as any;
      const name = path.replace('./', '').replace('.tsx', '');
      return {
        path: `/${name}`,
        status: mod.artifactStatus as ArtifactStatus,
        publishDate: mod.publishDate as string | undefined,
        title: mod.title as string | undefined,
        subtitle: mod.subtitle as string | undefined,
        isBlogPost: name.startsWith('blog/'),
      };
    })
    .sort((a, b) => {
      if (!a.publishDate && !b.publishDate) return 0;
      if (!a.publishDate) return 1;
      if (!b.publishDate) return -1;
      return b.publishDate.localeCompare(a.publishDate);
    });
}

const ArtifactsIndex = () => {
  const all = getArtifacts();

  const blogPosts = all.filter(a =>
    a.isBlogPost &&
    a.status === ArtifactStatus.PUBLISHED
  );

  const interactives = all.filter(a =>
    !a.isBlogPost &&
    a.status !== ArtifactStatus.UNLISTED &&
    a.status !== ArtifactStatus.HIDDEN
  );

  return (
    <div className="index-page">
      <header className="index-header">
        <h1 className="index-site-title">Abhinav Sharma</h1>
      </header>

      {blogPosts.length > 0 && (
        <section className="index-section">
          <h2 className="index-section-title">Writing</h2>
          <ul className="index-list">
            {blogPosts.map((a) => (
              <li key={a.path} className="index-blog-item">
                <Link to={a.path} className="index-blog-link">
                  <span className="index-blog-title">
                    {a.title || formatTitle(a.path)}
                  </span>
                  {a.subtitle && (
                    <span className="index-blog-subtitle">{a.subtitle}</span>
                  )}
                  {a.publishDate && (
                    <span className="index-blog-date">{formatDate(a.publishDate)}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {interactives.length > 0 && (
        <section className="index-section">
          <h2 className="index-section-title">Interactive Stuff</h2>
          <ul className="index-list">
            {interactives.map((a) => (
              <li key={a.path}>
                <Link to={a.path} className="index-interactive-link">
                  <span className="index-interactive-title">
                    {a.title || formatTitle(a.path)}
                  </span>
                  {a.publishDate && (
                    <span className="index-interactive-date">{formatDate(a.publishDate)}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default ArtifactsIndex;
