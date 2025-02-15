import React from 'react';
import { ThemeProvider } from './theme-provider';
import { ThemeToggle } from './theme-toggle';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {children}
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}