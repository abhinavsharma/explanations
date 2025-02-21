import React from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from './theme-provider';
import { ThemeToggle } from './theme-toggle';
import ArtifactWrapper, { ArtifactStatus } from './artifact-wrapper';

// Import all artifact modules
const artifactModules = import.meta.glob('../artifacts/*.tsx', { eager: true });

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isArtifactRoute = location.pathname !== '/';

  // Get the artifact status if it's an artifact route
  const getArtifactStatus = () => {
    if (!isArtifactRoute) return ArtifactStatus.UNLISTED;
    
    // Find the module by matching the URL path to the file name
    const path = location.pathname.slice(1); // Remove leading slash
    const moduleEntry = Object.entries(artifactModules).find(([modulePath]) => {
      const fileName = modulePath.split('/').pop()?.replace('.tsx', '');
      return fileName === path;
    });
    
    return moduleEntry ? (moduleEntry[1] as any).artifactStatus || ArtifactStatus.UNLISTED : ArtifactStatus.UNLISTED;
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