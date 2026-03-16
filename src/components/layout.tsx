import React from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from './theme-provider';
import { ThemeToggle } from './theme-toggle';
import ArtifactWrapper, { ArtifactStatus } from './artifact-wrapper';

// Import all artifact modules - use relative path from this file to artifacts
const artifactModules = import.meta.glob('/src/artifacts/*.tsx', { eager: true });

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

  const mod = getModule();
  const status = mod?.artifactStatus || ArtifactStatus.UNLISTED;
  const publishDate = mod?.publishDate as string | undefined;

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background transition-colors duration-300">
        {isArtifactRoute ? (
          <ArtifactWrapper status={status} publishDate={publishDate}>{children}</ArtifactWrapper>
        ) : (
          children
        )}
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}