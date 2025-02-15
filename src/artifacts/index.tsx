import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from "react-router-dom";

const ArtifactsIndex = () => {
  const artifacts = [
    { name: 'Entropy Explorer', path: '/entropy', description: 'Interactive visualization of information entropy components' },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Interactive Explanations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {artifacts.map((artifact) => (
              <Link 
                key={artifact.path}
                to={artifact.path}
                className="block p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900">{artifact.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{artifact.description}</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtifactsIndex;