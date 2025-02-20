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
}

export default function ArtifactWrapper({ children, status = ArtifactStatus.UNLISTED }: ArtifactWrapperProps) {
  // If the child is already a Card component, we just need to wrap it with our container
  // Otherwise, we need to wrap it with a Card
  const childrenArray = React.Children.toArray(children);
  const hasCard = childrenArray.some(child => 
    React.isValidElement(child) && 
    child.type === Card
  );

  const showBanner = status === ArtifactStatus.UNPUBLISHED;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-4">
      <div className="w-full max-w-4xl relative">
        <Link to="/" className="absolute -top-12 left-0">
          <Button variant="ghost" size="sm" className="gap-2 flex items-center">
            <Home className="w-4 h-4" />
            <span className="font-['Whizbang']" style={{ marginTop: '12px' }}>Home</span>
          </Button>
        </Link>
        {hasCard ? (
          <>
            {showBanner && (
              <div className="w-full bg-yellow-50 border-y border-yellow-200 px-4 py-2 text-yellow-800 text-sm mb-4">
                🚧 Work in Progress
              </div>
            )}
            {children}
          </>
        ) : (
          <Card>
            {showBanner && (
              <div className="w-full bg-yellow-50 border-y border-yellow-200 px-4 py-2 text-yellow-800 text-sm">
                🚧 Work in Progress
              </div>
            )}
            {children}
          </Card>
        )}
      </div>
    </div>
  );
} 