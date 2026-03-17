import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export enum ArtifactStatus {
  UNLISTED = 'unlisted',
  HIDDEN = 'hidden',
  UNPUBLISHED = 'unpublished',
  PUBLISHED = 'published'
}

export type ArtifactType = 'general' | 'blog-post';

interface ArtifactWrapperProps {
  children: React.ReactNode;
  status?: ArtifactStatus;
  artifactType?: ArtifactType;
  publishDate?: string;
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ArtifactWrapper({ children, status = ArtifactStatus.UNLISTED, artifactType = 'general', publishDate }: ArtifactWrapperProps) {
  const showBanner = status !== ArtifactStatus.PUBLISHED && status !== ArtifactStatus.HIDDEN;
  const isBlogPost = artifactType === 'blog-post';

  return (
    <div className="min-h-screen transition-colors duration-300" data-artifact-type={artifactType}>
      {isBlogPost ? (
        <nav className="blog-post-nav">
          <div className="blog-post-nav-inner">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 flex items-center">
                <Home className="w-4 h-4" />
                <span className="font-['IBM_Plex_Mono']">Home</span>
              </Button>
            </Link>
            {publishDate && (
              <span className="text-xs font-['IBM_Plex_Mono'] blog-post-date">
                {formatDate(publishDate)}
              </span>
            )}
          </div>
        </nav>
      ) : (
        <div className="flex items-center justify-between px-3 py-1 border-b border-border bg-background">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 flex items-center">
              <Home className="w-4 h-4" />
              <span className="font-['IBM_Plex_Mono']">Home</span>
            </Button>
          </Link>
          {publishDate && (
            <span className="text-xs text-muted-foreground font-['IBM_Plex_Mono'] pr-1">
              {formatDate(publishDate)}
            </span>
          )}
        </div>
      )}
      {showBanner && (
        <div className="w-full bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-900/50 px-4 py-2 text-yellow-800 dark:text-yellow-200 text-sm">
          🚧 Work in Progress {status === ArtifactStatus.UNLISTED && '(Unlisted)'}
        </div>
      )}
      {children}
    </div>
  );
}
