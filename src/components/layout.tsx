import React from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from './theme-provider';
import { ThemeToggle } from './theme-toggle';
import ArtifactWrapper, { ArtifactStatus } from './artifact-wrapper';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isArtifactRoute = location.pathname !== '/';

  // Get the artifact status if it's an artifact route
  const getArtifactStatus = () => {
    if (!isArtifactRoute) return ArtifactStatus.UNLISTED;
    
    const path = location.pathname.slice(1); // Remove leading slash
    try {
      // Dynamic import the module to get its status
      const mod = require(`../artifacts/${path}.tsx`);
      return mod.artifactStatus || ArtifactStatus.UNLISTED;
    } catch {
      return ArtifactStatus.UNLISTED;
    }
  };

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {isArtifactRoute ? (
          <ArtifactWrapper status={getArtifactStatus()}>{children}</ArtifactWrapper>
        ) : (
          children
        )}
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}