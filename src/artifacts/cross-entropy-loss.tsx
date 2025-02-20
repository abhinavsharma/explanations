import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

const CrossEntropyExplorer = () => {
  // True distribution (one-hot by default)
  const [trueDistribution, setTrueDistribution] = useState([1, 0, 0]);
  // Predicted probabilities
  const [predictions, setPredictions] = useState([0.7, 0.2, 0.1]);
  
  // Calculate -log(q) for a probability
  const negativeLog = (q) => q > 0 ? -Math.log2(q) : 0;
  
  // Calculate p * -log(q) for a pair of probabilities
  const crossEntropyComponent = (p, q) => p > 0 && q > 0 ? -p * Math.log2(q) : 0;
  
  // Generate data for the negative log visualization
  const negLogData = Array.from({length: 99}, (_, i) => {
    const prob = (i + 1) / 100;
    return {
      probability: prob,
      negativeLog: -Math.log2(prob)
    };
  });

  // Handle prediction changes
  const handlePredictionChange = (index, value) => {
    const newValue = parseFloat(value) || 0;
    const newPreds = [...predictions];
    newPreds[index] = newValue;
    
    // Normalize to ensure sum = 1
    const sum = newPreds.reduce((a, b) => a + b, 0);
    const normalizedPreds = newPreds.map(v => v / sum);
    
    setPredictions(normalizedPreds);
  };

  // Handle true label changes
  const handleTrueLabelChange = (index) => {
    const newDist = Array(trueDistribution.length).fill(0);
    newDist[index] = 1;
    setTrueDistribution(newDist);
  };

  // Calculate component-wise cross entropy data
  const crossEntropyData = trueDistribution.map((p, i) => {
    const q = predictions[i];
    return {
      outcome: `Class ${i + 1}`,
      trueProb: p,
      predProb: q,
      negLogProb: negativeLog(q),
      contribution: crossEntropyComponent(p, q)
    };
  });

  const totalCrossEntropy = crossEntropyData.reduce((sum, d) => sum + d.contribution, 0);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Understanding Cross-Entropy Loss</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
            <p className="text-sm mb-4">
              Cross-entropy loss H(P,Q) = -Σ P(x) * log₂(Q(x)) is a special case of KL divergence
              where P is typically a one-hot distribution (true labels) and Q represents model predictions.
              Since the true distribution P is one-hot, this simplifies to -log₂(q) for the correct class,
              where q is the predicted probability for that class.
            </p>

          <div>
            <h3 className="font-semibold mb-4">The Negative Log Loss Function</h3>
            <p className="text-sm mb-2">
              The core of cross-entropy loss is the negative log function -log₂(q).
              This penalizes low predicted probabilities for the true class:
              - As q → 1, loss → 0 (good predictions)
              - As q → 0, loss → ∞ (terrible predictions)
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={negLogData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="probability" 
                    label={{ value: 'Predicted Probability (q)', position: 'bottom' }}
                  />
                  <YAxis 
                    label={{ value: '-log₂(q)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <ReferenceLine x={1} stroke="#666" strokeDasharray="3 3">
                    <Label value="Perfect Prediction" position="top" />
                  </ReferenceLine>
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
            <h3 className="font-semibold mb-4">Interactive Example</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">True Label (One-Hot)</h4>
                {trueDistribution.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <label className="w-24">Class {i + 1}:</label>
                    <input
                      type="radio"
                      checked={p === 1}
                      onChange={() => handleTrueLabelChange(i)}
                      className="w-4 h-4"
                    />
                    <span className="w-16 text-right">{p.toFixed(0)}</span>
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Model Predictions</h4>
                {predictions.map((q, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <label className="w-24">Class {i + 1}:</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={q}
                      onChange={(e) => handlePredictionChange(i, e.target.value)}
                      className="w-full"
                    />
                    <span className="w-16 text-right">{q.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="font-medium mb-2">Predicted Probabilities</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={crossEntropyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis dataKey="outcome" />
                      <YAxis domain={[0, 1]} />
                      <Tooltip />
                      <Bar dataKey="predProb" fill="#82ca9d" name="Predicted Prob." />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Negative Log of Predictions</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={crossEntropyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis dataKey="outcome" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="negLogProb" fill="#8884d8" name="-log₂(q)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Loss Contributions</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={crossEntropyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="outcome" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="contribution" 
                      fill="#ff7300" 
                      name="p * -log₂(q)"
                    />
                    <ReferenceLine y={0} stroke="#000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Total Cross-Entropy Loss: {totalCrossEntropy.toFixed(3)} bits</h4>
              <p className="text-sm mb-2">
                Key properties of cross-entropy loss:
              </p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Only the prediction for the true class affects the loss (due to one-hot P)</li>
                <li>Loss is minimized (= 0) when predicting probability 1 for the true class</li>
                <li>Loss grows rapidly as predicted probability for the true class approaches 0</li>
                <li>This asymmetric penalty creates strong gradients for learning</li>
                <li>The logarithm makes the loss additive across examples</li>
              </ul>
              <p className="text-sm mt-2">
                Try selecting different true classes and adjusting predictions to see how:
                1. Only the true class's prediction matters
                2. The loss severely penalizes low confidence in the true class
                3. Other class probabilities only matter for normalization
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrossEntropyExplorer;