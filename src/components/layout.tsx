import React from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from './theme-provider';
import { ThemeToggle } from './theme-toggle';
import ArtifactWrapper from './artifact-wrapper';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isArtifactRoute = location.pathname !== '/';

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {isArtifactRoute ? (
          <ArtifactWrapper>{children}</ArtifactWrapper>
        ) : (
          children
        )}
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}