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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-8 py-12">
      <h1 className="text-3xl mb-8 text-gray-900 dark:text-white">
        Interactive Explanations
      </h1>
      <ul className="max-w-2xl  space-y-3">
        {artifacts.map((artifact) => (
          <li key={artifact.path}>
            <Link 
              to={artifact.path}
              className="block font-['Computer_Modern'] text-lg text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
            >
              {artifact.path
                .replace('/', '')
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArtifactsIndex;