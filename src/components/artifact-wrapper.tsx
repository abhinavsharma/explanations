import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import React from 'react';

export enum ArtifactStatus {
  UNLISTED = 'unlisted',
  UNPUBLISHED = 'unpublished',
  PUBLISHED = 'published'
}

interface ArtifactWrapperProps {
  children: React.ReactNode;
  status?: ArtifactStatus;
  publishDate?: string;
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ArtifactWrapper({ children, status = ArtifactStatus.UNLISTED, publishDate }: ArtifactWrapperProps) {
  // If the child is already a Card component, we just need to wrap it with our container
  // Otherwise, we need to wrap it with a Card
  const childrenArray = React.Children.toArray(children);
  const hasCard = childrenArray.some(child => 
    React.isValidElement(child) && 
    child.type === Card
  );

  const showBanner = status !== ArtifactStatus.PUBLISHED;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="flex items-center justify-between px-3 py-1 border-b border-border">
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
      {showBanner && (
        <div className="w-full bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-900/50 px-4 py-2 text-yellow-800 dark:text-yellow-200 text-sm">
          🚧 Work in Progress {status === ArtifactStatus.UNLISTED && '(Unlisted)'}
        </div>
      )}
      {hasCard ? children : <Card className="m-4">{children}</Card>}
    </div>
  );
} 