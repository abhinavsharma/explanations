import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

const EntropyComponentsExplorer = () => {
  const [distribution, setDistribution] = useState([0.2, 0.2, 0.2, 0.2, 0.2]);
  
  // Calculate -log2(p) for a probability
  const negativeLog2 = (p) => p > 0 ? -Math.log2(p) : 0;
  
  // Calculate p * -log2(p) for a probability
  const entropyComponent = (p) => p > 0 ? -p * Math.log2(p) : 0;
  
  // Generate data for -log2(p) function visualization
  const logData = Array.from({length: 99}, (_, i) => {
    const p = (i + 1) / 100;
    return {
      probability: p,
      negativeLog: negativeLog2(p)
    };
  });

  // Handle distribution changes
  const handleDistributionChange = (index, value) => {
    const newValue = parseFloat(value) || 0;
    const newDist = [...distribution];
    newDist[index] = newValue;
    
    // Normalize to ensure sum = 1
    const sum = newDist.reduce((a, b) => a + b, 0);
    const normalizedDist = newDist.map(v => v / sum);
    
    setDistribution(normalizedDist);
  };

  // Calculate component-wise entropy data
  const entropyData = distribution.map((p, i) => ({
    outcome: `Outcome ${i + 1}`,
    probability: p,
    negativeLog: negativeLog2(p),
    contribution: entropyComponent(p)
  }));

  const totalEntropy = entropyData.reduce((sum, d) => sum + d.contribution, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Understanding Entropy Components</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <p className="text-sm mb-4 text-slate-800 dark:text-slate-200">
              Entropy H(P) = -Σ P(x) * log₂(P(x)) is built up from two components:
              1. The probability P(x) of each outcome
              2. The negative logarithm -log₂(P(x)), which measures "surprise"
              
              The total entropy is the sum of their products for each outcome.
              High surprise (low probability) events contribute more per occurrence,
              but happen less often. Low surprise (high probability) events contribute
              less per occurrence, but happen more often.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-slate-800 dark:text-slate-100">The Negative Log Function</h3>
            <p className="text-sm mb-2 text-slate-700 dark:text-slate-300">
              This shows how -log₂(p) approaches infinity as p→0 and equals 0 when p=1. The product p * -log₂(p) creates a curve that peaks at p = 1/e ≈ 0.368, demonstrating why spreading probability across multiple outcomes maximizes entropy.
              This captures the intuition that rare events are more "surprising".
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={logData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="probability" 
                    label={{ value: 'Probability (p)', position: 'bottom' }}
                  />
                  <YAxis 
                    label={{ value: '-log₂(p)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="negativeLog" 
                    stroke="#8884d8" 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Interactive Distribution</h3>
            <div className="grid grid-cols-1 gap-4 mb-4">
              {distribution.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <label className="w-24">P({i + 1}):</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={p}
                    onChange={(e) => handleDistributionChange(i, e.target.value)}
                    className="w-full"
                  />
                  <span className="w-16 text-right">{p.toFixed(3)}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Probabilities</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={entropyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis dataKey="outcome" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="probability" fill="#8884d8" name="P(x)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Negative Log (Surprise)</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={entropyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis dataKey="outcome" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="negativeLog" fill="#82ca9d" name="-log₂(P(x))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Entropy Contributions (Product)</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={entropyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="outcome" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="contribution" 
                      fill="#ff7300" 
                      name="P(x) * -log₂(P(x))"
                    />
                    <ReferenceLine y={0} stroke="#000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Why Uniform Distributions Maximize Entropy</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis 
                      domain={[0, 1]}
                      label={{ value: 'Probability (p)', position: 'bottom' }}
                    />
                    <YAxis 
                      label={{ value: 'Contribution to Entropy', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Line 
                      data={Array.from({length: 99}, (_, i) => {
                        const p = (i + 1) / 100;
                        return {
                          probability: p,
                          contribution: -p * Math.log2(p)
                        };
                      })}
                      type="monotone"
                      dataKey="contribution"
                      stroke="#ff7300"
                      dot={false}
                      name="p * -log₂(p)"
                    />
                    <ReferenceLine x={1/Math.E} stroke="#666" strokeDasharray="3 3">
                      <Label value="p = 1/e" position="top" />
                    </ReferenceLine>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h4 className="font-medium mb-2 text-slate-800 dark:text-slate-100">Total Entropy: {totalEntropy.toFixed(3)} bits</h4>
                <p className="text-sm mb-2 text-slate-700 dark:text-slate-300">
                  The curve above shows how much entropy a single outcome contributes based on its probability.
                  This contribution (p * -log₂(p)) peaks at p = 1/e ≈ 0.368. Why does this explain maximum entropy?
                </p>
                <ul className="text-sm list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>When probabilities are very uneven, some outcomes have high p (right side of curve) and others low p (left side)</li>
                  <li>The curve shows that both extremes contribute little to entropy</li>
                  <li>When we make probabilities more uniform, all outcomes move toward the middle of the curve</li>
                  <li>With n outcomes, the uniform distribution puts each at p = 1/n</li>
                  <li>This balanced arrangement maximizes the total contribution to entropy</li>
                </ul>
                <p className="text-sm mt-2 text-slate-700 dark:text-slate-300">
                  Try moving the probabilities above to see this principle in action. As you make the distribution
                  more uniform, you'll see the entropy increase because each outcome contributes more effectively
                  to the total.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EntropyComponentsExplorer;