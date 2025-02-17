import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import React from 'react';

export default function ArtifactWrapper({ children }: { children: React.ReactNode }) {
  // If the child is already a Card component, we just need to wrap it with our container
  // Otherwise, we need to wrap it with a Card
  const childrenArray = React.Children.toArray(children);
  const hasCard = childrenArray.some(child => 
    React.isValidElement(child) && 
    (child.type === Card || (child.type as any)?.displayName === 'Card')
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-4">
      <div className="w-full max-w-4xl relative">
        <Link to="/" className="absolute -top-12 left-0">
          <Button variant="ghost" size="sm" className="gap-2">
            <Home className="w-4 h-4" />
            <span className="font-cmr">Home</span>
          </Button>
        </Link>
        {hasCard ? children : (
          <Card>
            {children}
          </Card>
        )}
      </div>
    </div>
  );
} 