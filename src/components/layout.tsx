import React from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from './theme-provider';
import { ThemeToggle } from './theme-toggle';
import ArtifactWrapper, { ArtifactStatus } from './artifact-wrapper';
import type { ArtifactType } from './artifact-wrapper';

// Import all artifact modules including subdirectories
const artifactModules = import.meta.glob('/src/artifacts/**/*.tsx', { eager: true });

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isArtifactRoute = location.pathname !== '/';

  const getModule = () => {
    if (!isArtifactRoute) return null;
    const path = location.pathname.slice(1);
    const entry = Object.entries(artifactModules).find(([modulePath]) => {
      const fileName = modulePath.match(/\/src\/artifacts\/(.+)\.tsx$/)?.[1];
      return fileName === path;
    });
    return entry ? (entry[1] as any) : null;
  };

  const getArtifactType = (): ArtifactType => {
    const path = location.pathname;
    if (path.startsWith('/blog-post/')) return 'blog-post';
    return 'general';
  };

  const mod = getModule();
  const status = mod?.artifactStatus || ArtifactStatus.UNLISTED;
  const publishDate = mod?.publishDate as string | undefined;
  const artifactType = getArtifactType();

  return (
    <ThemeProvider defaultTheme="light">
      <div className={`min-h-screen transition-colors duration-300 ${artifactType === 'blog-post' ? 'blog-post-outer' : 'bg-background'}`}>
        {isArtifactRoute ? (
          <ArtifactWrapper status={status} artifactType={artifactType} publishDate={publishDate}>{children}</ArtifactWrapper>
        ) : (
          children
        )}
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}