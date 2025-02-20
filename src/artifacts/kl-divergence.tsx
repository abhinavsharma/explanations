import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { ArtifactStatus } from '@/components/artifact-wrapper';

export const artifactStatus = ArtifactStatus.UNPUBLISHED;

const KLDivergenceComponentsExplorer = () => {
  const [distributionP, setDistributionP] = useState([0.3, 0.4, 0.3]);
  const [distributionQ, setDistributionQ] = useState([0.1, 0.8, 0.1]);
  
  // Calculate log(P/Q) for probabilities
  const logRatio = (p, q) => p > 0 && q > 0 ? Math.log2(p / q) : 0;
  
  // Calculate P * log(P/Q) for a pair of probabilities
  const klComponent = (p, q) => p > 0 && q > 0 ? p * Math.log2(p / q) : 0;
  
  // Generate data for the log ratio visualization
  const logRatioData = Array.from({length: 99}, (_, i) => {
    const ratio = (i + 1) / 33; // Will give ratios from ~0.03 to 3
    return {
      ratio,
      logValue: Math.log2(ratio)
    };
  });

  // Handle distribution changes
  const handleDistributionChange = (dist, index, value) => {
    const newValue = parseFloat(value) || 0;
    const newDist = dist === 'P' ? [...distributionP] : [...distributionQ];
    newDist[index] = newValue;
    
    // Normalize to ensure sum = 1
    const sum = newDist.reduce((a, b) => a + b, 0);
    const normalizedDist = newDist.map(v => v / sum);
    
    if (dist === 'P') {
      setDistributionP(normalizedDist);
    } else {
      setDistributionQ(normalizedDist);
    }
  };

  // Calculate component-wise KL divergence data
  const klData = distributionP.map((p, i) => {
    const q = distributionQ[i];
    return {
      outcome: `Outcome ${i + 1}`,
      P: p,
      Q: q,
      ratio: p / q,
      logRatio: logRatio(p, q),
      contribution: klComponent(p, q)
    };
  });

  const totalKL = klData.reduce((sum, d) => sum + d.contribution, 0);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Understanding KL Divergence Components</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
            <p className="mb-4">
                KL divergence D(P||Q) = Σ P(x) * log₂(P(x)/Q(x)) measures how well Q approximates P.
            </p>
            <p className="mb-4">
                It combines two key elements:
            </p>
            <ol className="list-decimal pl-5 space-y-1">
                <li>The probability P(x) of each outcome under distribution P</li>
                <li>The log ratio log₂(P(x)/Q(x)), which measures how different P and Q are at each outcome</li>
            </ol>
            <p>
                The total KL divergence is the weighted sum of these log ratios, where the weights are
                the probabilities from P. This means we care more about differences in regions where P
                assigns high probability.
            </p>
            <div>
                <hr></hr>
            <h2 className="font-semibold my-4">Play with 2 distributions</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Distribution P</h4>
                {distributionP.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <label className="w-24">P({i + 1}):</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={p}
                      onChange={(e) => handleDistributionChange('P', i, e.target.value)}
                      className="w-full"
                    />
                    <span className="w-16 text-right">{p.toFixed(3)}</span>
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Distribution Q</h4>
                {distributionQ.map((q, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <label className="w-24">Q({i + 1}):</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={q}
                      onChange={(e) => handleDistributionChange('Q', i, e.target.value)}
                      className="w-full"
                    />
                    <span className="w-16 text-right">{q.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="font-medium mb-2">Raw vs Log Ratio Comparison</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis 
                        domain={[0, 5]}
                        label={{ value: 'Ratio (P/Q)', position: 'bottom' }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        data={Array.from({length: 100}, (_, i) => {
                          const ratio = (i + 1) / 20;
                          return {
                            ratio,
                            raw: ratio,
                            log: Math.log2(ratio)
                          };
                        })}
                        type="monotone"
                        dataKey="raw"
                        stroke="#8884d8"
                        name="Raw Ratio (P/Q)"
                        dot={false}
                      />
                      <Line 
                        data={Array.from({length: 100}, (_, i) => {
                          const ratio = (i + 1) / 20;
                          return {
                            ratio,
                            raw: ratio,
                            log: Math.log2(ratio)
                          };
                        })}
                        type="monotone"
                        dataKey="log"
                        stroke="#82ca9d"
                        name="Log Ratio (log₂(P/Q))"
                        dot={false}
                      />
                      <ReferenceLine x={1} stroke="#666" strokeDasharray="3 3">
                        <Label value="P = Q" position="top" />
                      </ReferenceLine>
                      <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Log Ratio (log₂(P/Q))</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={klData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis dataKey="outcome" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="logRatio" fill="#82ca9d" name="log₂(P/Q)" />
                      <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Each outcome's contribution to KL divergence</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={klData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="outcome" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="contribution" 
                      fill="#ff7300" 
                      name="P * log₂(P/Q)"
                    />
                    <ReferenceLine y={0} stroke="#000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

              <h4 className="font-medium mb-2">Total KL Divergence: {totalKL.toFixed(3)} bits</h4>
              <hr className="my-4"></hr>
              <p className="text-sm mb-2">
                Key properties of KL divergence demonstrated above:
              </p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>KL divergence is always non-negative (≥ 0)</li>
                <li>It equals 0 if and only if P = Q</li>
                <li>Large contributions occur when:
                  <ul className="pl-5 mt-1">
                    <li>P is much larger than Q (positive contribution)</li>
                    <li>P assigns high probability to these differences</li>
                  </ul>
                </li>
                <li>When Q is larger than P, the contribution is smaller because P weights it less</li>
              </ul>
              <p className="text-sm mt-2">
                Try making P and Q identical to see the divergence go to 0, or make them very different
                in regions where P has high probability to see large divergence values.
              </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">The Probability Term P(x)</h3>
            <p className="text-sm mb-2">
              The P(x) term acts as a weighting factor in KL divergence, determining how much each outcome's difference contributes:
            </p>
            <ul className="text-sm list-disc pl-5 space-y-1 mb-2">
              <li>When P(x) is large, differences between P and Q are weighted more heavily</li>
              <li>When P(x) is small, even large differences between P and Q contribute less to the total divergence</li>
              <li>This weighting ensures we focus on matching Q to P in regions where P considers the outcomes likely</li>
            </ul>
            <p className="text-sm mb-2">
              This asymmetric weighting is why KL divergence is not symmetric - D(P||Q) ≠ D(Q||P). 
              It reflects that we care more about Q's accuracy in regions where P assigns high probability.
            </p>

            <h3 className="font-semibold mb-4">The Log Ratio Function</h3>
            <p className="text-sm mb-2">
              Why do we use log₂(P/Q) instead of just P/Q? The log transform provides three crucial properties:
            </p>
            <ul className="text-sm list-disc pl-5 space-y-1 mb-2">
              <li>It makes the measure <em>additive</em> - differences in distributions compound by addition rather than multiplication</li>
              <li>It creates <em>symmetry around 0</em> - a ratio of 2 (P twice Q) and 1/2 (Q twice P) have equal magnitude but opposite signs</li>
              <li>It <em>penalizes extreme ratios sub-linearly</em> - doubling the ratio creates a constant increase rather than scaling proportionally</li>
            </ul>
            <p className="text-sm mb-2">
              Notice how the log curve below "compresses" large ratios while maintaining sensitivity to small differences near P=Q.
              This balances the importance of matching P across all probability ranges.
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={logRatioData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="ratio" 
                    label={{ value: 'Ratio (P/Q)', position: 'bottom' }}
                  />
                  <YAxis 
                    label={{ value: 'log₂(P/Q)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <ReferenceLine x={1} stroke="#666" strokeDasharray="3 3">
                    <Label value="P = Q" position="top" />
                  </ReferenceLine>
                  <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                  <Line 
                    type="monotone" 
                    dataKey="logValue" 
                    stroke="#8884d8" 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          
        </div>
      </CardContent>
    </Card>
  );
};

export default KLDivergenceComponentsExplorer;