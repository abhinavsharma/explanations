import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from "react-router-dom";

const artifactModules = import.meta.glob('./*.tsx', { eager: true });

const ArtifactsIndex = () => {
  const artifacts = Object.entries(artifactModules)
    .filter(([path]) => !path.includes('index'))
    .map(([path]) => {
      const name = path.replace('./', '').replace('.tsx', '');
      return {
        path: `/${name}`,
      };
    });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">Interactive Explanations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {artifacts.map((artifact) => (
              <Link 
                key={artifact.path}
                to={artifact.path}
                className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-900 dark:text-gray-100"
              >
                <h2 className="text-lg font-semibold">
                  {artifact.path
                    .replace('/', '')
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </h2>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtifactsIndex;