import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ChartContainer } from '@/components/ui/chart';
import * as RechartsPrimitive from 'recharts';

const SpamClassifierDemo = () => {
  // Sample emails with their spam scores and true labels
  const emails = [
    { id: 1, score: 0.95, isActuallySpam: true, 
      content: "CONGRATULATIONS! You've WON $1,000,000!!!" },
    { id: 2, score: 0.89, isActuallySpam: true,
      content: "Buy cheap medications now! Limited time offer!" },
    { id: 3, score: 0.82, isActuallySpam: true,
      content: "Work from home! Earn $5000/week guaranteed!" },
    { id: 4, score: 0.78, isActuallySpam: false,
      content: "Your order #1234 has shipped - Track your package" },
    { id: 5, score: 0.71, isActuallySpam: true,
      content: "URGENT: Your account needs verification NOW" },
    { id: 6, score: 0.65, isActuallySpam: false,
      content: "15% off your next purchase at Electronics Store" },
    { id: 7, score: 0.58, isActuallySpam: true,
      content: "Meet singles in your area tonight!" },
    { id: 8, score: 0.52, isActuallySpam: false,
      content: "Your subscription payment is due tomorrow" },
    { id: 9, score: 0.48, isActuallySpam: true,
      content: "Claim your inheritance from a distant relative!" },
    { id: 10, score: 0.42, isActuallySpam: false,
      content: "Team meeting rescheduled to 3pm tomorrow" },
    { id: 11, score: 0.35, isActuallySpam: false,
      content: "Your flight reservation confirmation" },
    { id: 12, score: 0.28, isActuallySpam: false,
      content: "Library: Your book is due in 3 days" },
    { id: 13, score: 0.22, isActuallySpam: false,
      content: "Jane shared a Google Doc with you" },
    { id: 14, score: 0.15, isActuallySpam: false,
      content: "Your Amazon order has been delivered" },
    { id: 15, score: 0.08, isActuallySpam: false,
      content: "Mom: Are we still on for dinner Sunday?" },
  ];

  const [threshold, setThreshold] = useState(0.5);

  // Generate data points for the plots
  const thresholdPoints = useMemo(() => {
    const points = [];
    for (let t = 0; t <= 1; t += 0.1) {
      const classified = emails.map(email => ({
        ...email,
        predictedSpam: email.score >= t,
        category: email.isActuallySpam 
          ? (email.score >= t ? 'TP' : 'FN')
          : (email.score >= t ? 'FP' : 'TN')
      }));

      const tp = classified.filter(i => i.category === 'TP').length;
      const fp = classified.filter(i => i.category === 'FP').length;
      const fn = classified.filter(i => i.category === 'FN').length;
      const tn = classified.filter(i => i.category === 'TN').length;

      // Handle edge cases better for precision and recall
      const precision = tp === 0 && fp === 0 ? 1 : tp / (tp + fp);
      const recall = tp === 0 && fn === 0 ? 1 : tp / (tp + fn);
      const f1 = precision === 0 && recall === 0 ? 0 : 2 * (precision * recall) / (precision + recall);
      const am = (precision + recall) / 2;
      const gm = Math.sqrt(precision * recall);
      const hm = f1 / 2;

      // Calculate ROC metrics with better edge case handling
      const tpr = recall;
      const fpr = tn === 0 && fp === 0 ? 0 : fp / (fp + tn);

      points.push({
        threshold: t,
        precision,
        recall,
        f1,
        am,
        gm,
        hm,
        tpr,
        fpr
      });
    }
    return points;
  }, [emails]);

  // Classify emails based on threshold
  const classifiedEmails = emails.map(email => ({
    ...email,
    predictedSpam: email.score >= threshold,
    category: email.isActuallySpam 
      ? (email.score >= threshold ? 'TP' : 'FN')
      : (email.score >= threshold ? 'FP' : 'TN')
  }));

  // Calculate metrics
  const tp = classifiedEmails.filter(i => i.category === 'TP').length;
  const fp = classifiedEmails.filter(i => i.category === 'FP').length;
  const fn = classifiedEmails.filter(i => i.category === 'FN').length;
  const tn = classifiedEmails.filter(i => i.category === 'TN').length;

  // Calculate metrics with edge case handling
  const precision = tp === 0 && fp === 0 ? 1 : tp / (tp + fp);
  const recall = tp === 0 && fn === 0 ? 1 : tp / (tp + fn);
  const f1 = precision === 0 && recall === 0 ? 0 : 2 * (precision * recall) / (precision + recall);
  
  // Calculate additional metrics
  const am = (precision + recall) / 2;
  const gm = Math.sqrt(precision * recall);
  const hm = f1 / 2; // F1 is actually 2 * HM

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Precision, Recall and tradeoffs like F1 and ROC</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Introduction */}
          <div className="p-4 rounded-lg space-y-2">
            <p className="font-medium">Imagine you're building a spam filter for email:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Each email gets a "spam score" from 0% to 100%</li>
              <li>Higher scores mean the email looks more like spam</li>
              <li>The classification threshold is like a cut-off point: any email with a score above this gets marked as spam</li>
            </ul>
            <p className="mt-2">Below are 15 sample emails. Try moving the threshold to see how it affects the classification:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li><span className="text-green-600 font-medium">True Positive</span>: Correctly caught actual spam</li>
              <li><span className="text-red-600 font-medium">False Positive</span>: Mistakenly marked real email as spam</li>
              <li><span className="text-yellow-600 font-medium">False Negative</span>: Missed catching actual spam</li>
              <li><span className="text-gray-600 font-medium">True Negative</span>: Correctly let through real email</li>
            </ul>
          </div>
            
          {/* Emails visualization */}
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left font-medium text-muted-foreground">Email Content</th>
                  <th className="p-3 text-center font-medium text-muted-foreground w-[80px]">Actual</th>
                  <th className="p-3 text-center font-medium text-muted-foreground w-[80px]">Marked</th>
                  <th className="p-3 text-right font-medium text-muted-foreground w-[80px]">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {classifiedEmails.map(email => (
                  <tr 
                    key={email.id}
                    className={`
                      ${email.category === 'TP' ? 'bg-green-500/10 dark:bg-green-500/20' : ''}
                      ${email.category === 'FP' ? 'bg-red-500/10 dark:bg-red-500/20' : ''}
                      ${email.category === 'FN' ? 'bg-yellow-500/10 dark:bg-yellow-500/20' : ''}
                      ${email.category === 'TN' ? 'bg-muted/50' : ''}
                    `}
                  >
                    <td className="p-3">{email.content}</td>
                    <td className="p-3 text-center">
                      {email.isActuallySpam ? 'Spam' : 'Real'}
                    </td>
                    <td className="p-3 text-center">
                      {email.predictedSpam ? 'Spam' : 'Real'}
                    </td>
                    <td className="p-3 text-right font-medium">
                      {(email.score * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Threshold Control */}
          <hr></hr>
          <h3 className="my-4">Slide Me!</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-lg font-medium">Spam Detection Threshold: {threshold.toFixed(1)}</div>
                <div className="text-sm text-gray-600">
                  {threshold < 0.3 ? "Very lenient: Lets most emails through" :
                   threshold < 0.5 ? "Lenient: Might miss some spam but won't block real emails" :
                   threshold < 0.7 ? "Moderate: Balanced between catching spam and avoiding mistakes" :
                   threshold < 0.9 ? "Strict: Catches most spam but might block some real emails" :
                   "Very strict: Blocks almost everything suspicious"}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                ← More emails marked as spam | More emails let through →
              </div>
            </div>
            <Slider
              value={[threshold]}
              onValueChange={([value]) => setThreshold(Math.round(value * 10) / 10)}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Additional Metrics */}
          <div className="space-y-4">
            {/* Confusion Matrix */}
            <div className="p-4 rounded-lg">
              <div className="text-lg font-medium mb-2">Confusion Matrix</div>
              <div className="grid grid-cols-[auto_1fr] gap-2">
                {/* Header row */}
                <div className="invisible">Spacer</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center font-medium">Predicted Spam</div>
                  <div className="text-center font-medium">Predicted Not Spam</div>
                </div>
                {/* First data row */}
                <div className="font-medium self-center">Actually Spam</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-500/20 dark:bg-green-500/30 p-2 rounded text-center">
                    <div className="font-bold">{tp}</div>
                    <div className="text-sm">True Positive</div>
                  </div>
                  <div className="bg-yellow-500/20 dark:bg-yellow-500/30 p-2 rounded text-center">
                    <div className="font-bold">{fn}</div>
                    <div className="text-sm">False Negative</div>
                  </div>
                </div>
                {/* Second data row */}
                <div className="font-medium self-center">Actually Not Spam</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-red-500/20 dark:bg-red-500/30 p-2 rounded text-center">
                    <div className="font-bold">{fp}</div>
                    <div className="text-sm">False Positive</div>
                  </div>
                  <div className="bg-gray-500/20 dark:bg-gray-500/30 p-2 rounded text-center">
                    <div className="font-bold">{tn}</div>
                    <div className="text-sm">True Negative</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg">
              <div className="text-lg font-medium mb-4">Current Metrics</div>
              <div className="flex gap-6">
                <ChartContainer className="h-[600px] w-[400px]" config={{}}>
                  <RechartsPrimitive.BarChart 
                    data={[{
                      name: 'Precision',
                      value: precision,
                      description: 'When we mark something as spam, how often are we right?',
                      formula: `${tp} / (${tp} + ${fp}) emails`
                    }, {
                      name: 'Recall',
                      value: recall,
                      description: 'Out of all actual spam, how much did we catch?',
                      formula: `${tp} / (${tp} + ${fn}) emails`
                    }, {
                      name: 'F1 Score',
                      value: f1,
                      description: 'Harmonic mean of precision and recall',
                      formula: '2 * (P * R) / (P + R)'
                    }, {
                      name: 'AM',
                      value: am,
                      description: 'Simple average, less sensitive to imbalance',
                      formula: '(P + R) / 2'
                    }, {
                      name: 'GM',
                      value: gm,
                      description: 'Geometric mean, moderately penalizes imbalance',
                      formula: '√(P * R)'
                    }]}
                    layout="vertical"
                    margin={{ top: 20, right: 20, bottom: 20, left: 100 }}
                  >
                    <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <RechartsPrimitive.YAxis type="category" dataKey="name" width={80} />
                    <RechartsPrimitive.XAxis 
                      type="number"
                      domain={[0, 1]}
                      tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    />
                    <RechartsPrimitive.Bar dataKey="value" fill="#8884d8" />
                  </RechartsPrimitive.BarChart>
                </ChartContainer>

                <div className="space-y-4 flex-1">
                  <div className="font-medium">Understanding Different Metrics:</div>
                  <div className="space-y-3">
                    <div className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="font-medium">Precision: {(precision * 100).toFixed(1)}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Measures accuracy of spam predictions - higher means fewer false alarms.</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Formula: {tp} / ({tp} + {fp}) emails</div>
                    </div>
                    <div className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="font-medium">Recall: {(recall * 100).toFixed(1)}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Measures completeness of spam detection - higher means fewer missed spam.</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Formula: {tp} / ({tp} + {fn}) emails</div>
                    </div>
                    <div className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="font-medium">F1 Score: {(f1 * 100).toFixed(1)}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Balances precision and recall - best when you need both metrics to be high.</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Formula: 2 * (P * R) / (P + R)</div>
                    </div>
                    <div className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="font-medium">Arithmetic Mean: {(am * 100).toFixed(1)}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Most lenient - treats both metrics equally. Best when both are equally important.</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Formula: (P + R) / 2</div>
                    </div>
                    <div className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="font-medium">Geometric Mean: {(gm * 100).toFixed(1)}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Moderate - somewhat penalizes large differences between precision and recall.</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Formula: √(P * R)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            

            
          </div>
        </div>

        {/* Metrics Over Threshold Plot */}
        <div className="p-4 rounded-lg">
            <h3 className="mb-4">Considering all thresholds</h3>
            <ChartContainer className="h-[400px]" config={{}}>
              <RechartsPrimitive.LineChart data={thresholdPoints} margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                <RechartsPrimitive.XAxis 
                  dataKey="threshold"
                  domain={[0, 1]}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  label={{ value: "Threshold", position: "bottom", offset: 40 }}
                />
                <RechartsPrimitive.YAxis 
                  domain={[0, 1]}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  label={{ value: "Score", angle: -90, position: "left", offset: 40 }}
                />
                <RechartsPrimitive.Tooltip 
                  formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                />
                <RechartsPrimitive.Legend />
                <RechartsPrimitive.Line type="monotone" dataKey="precision" stroke="#4f46e5" strokeWidth={2} name="Precision" />
                <RechartsPrimitive.Line type="monotone" dataKey="recall" stroke="#22c55e" strokeWidth={2} name="Recall" />
                <RechartsPrimitive.Line type="monotone" dataKey="f1" stroke="#f97316" strokeWidth={2} name="F1 Score" />
                <RechartsPrimitive.Line type="monotone" dataKey="am" stroke="#ec4899" strokeWidth={2} name="AM" />
                <RechartsPrimitive.Line type="monotone" dataKey="gm" stroke="#eab308" strokeWidth={2} name="GM" />
                <RechartsPrimitive.ReferenceLine x={threshold} stroke="red" strokeDasharray="3 3" />
              </RechartsPrimitive.LineChart>
            </ChartContainer>
          </div>

        {/* Charts stacked vertically */}
        <div className="space-y-4">
          {/* Precision-Recall Scatter Plot */}
          <div className="p-4 rounded-lg">
            <h3 className="mb-4">Precision vs Recall Trade-off</h3>
            <ChartContainer className="h-[400px]" config={{}}>
              <RechartsPrimitive.ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                <RechartsPrimitive.XAxis 
                  type="number" 
                  dataKey="recall" 
                  name="Recall" 
                  domain={[0, 1]}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  label={{ value: "Recall", position: "bottom", offset: 40 }}
                />
                <RechartsPrimitive.YAxis 
                  type="number" 
                  dataKey="precision" 
                  name="Precision" 
                  domain={[0, 1]}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  label={{ value: "Precision", angle: -90, position: "left", offset: 40 }}
                />
                <RechartsPrimitive.Tooltip 
                  formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                  labelFormatter={(_, payload) => `Threshold: ${payload[0]?.payload.threshold.toFixed(1)}`}
                />
                <RechartsPrimitive.Scatter
                  data={thresholdPoints}
                  fill="#8884d8"
                >
                  <RechartsPrimitive.LabelList
                    dataKey="threshold"
                    position="right"
                    formatter={(value) => value.toFixed(1)}
                    style={{ fontSize: '11px' }}
                  />
                </RechartsPrimitive.Scatter>
                <RechartsPrimitive.Scatter
                  data={[thresholdPoints.find(p => p.threshold === threshold)]}
                  fill="#ff0000"
                  r={8}
                />
              </RechartsPrimitive.ScatterChart>
            </ChartContainer>
          </div>

          

          {/* ROC Curve Plot */}
          <div className="p-4 rounded-lg">
            <h3 className="mb-4">ROC Curve</h3>
            
            <ChartContainer className="h-[400px]" config={{}}>
              <RechartsPrimitive.ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                <RechartsPrimitive.XAxis 
                  type="number" 
                  dataKey="fpr" 
                  name="False Positive Rate" 
                  domain={[0, 1]}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  label={{ value: "False Positive Rate", position: "bottom", offset: 40 }}
                />
                <RechartsPrimitive.YAxis 
                  type="number" 
                  dataKey="tpr" 
                  name="True Positive Rate" 
                  domain={[0, 1]}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  label={{ value: "True Positive Rate", angle: -90, position: "left", offset: 40 }}
                />
                <RechartsPrimitive.Tooltip 
                  formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                  labelFormatter={(_, payload) => `Threshold: ${payload[0]?.payload.threshold.toFixed(1)}`}
                />
                {/* Random guess line */}
                <RechartsPrimitive.Line
                  data={[{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }]}
                  dataKey="tpr"
                  stroke="#666666"
                  strokeDasharray="3 3"
                  type="linear"
                  dot={false}
                />
                {/* Add a line to connect ROC points */}
                <RechartsPrimitive.Line
                  data={thresholdPoints.sort((a, b) => a.fpr - b.fpr)}
                  type="monotone"
                  dataKey="tpr"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
                <RechartsPrimitive.Scatter
                  data={thresholdPoints}
                  fill="#8884d8"
                >
                  <RechartsPrimitive.LabelList
                    dataKey="threshold"
                    position="right"
                    formatter={(value) => value.toFixed(1)}
                    style={{ fontSize: '11px' }}
                  />
                </RechartsPrimitive.Scatter>
                <RechartsPrimitive.Scatter
                  data={[thresholdPoints.find(p => p.threshold === threshold)]}
                  fill="#ff0000"
                  r={8}
                />
              </RechartsPrimitive.ScatterChart>
            </ChartContainer>
            <div className="text-sm space-y-2 p-4 rounded-lg mb-4">
              <div className="font-medium">Understanding the ROC Curve:</div>
              <p>The ROC curve shows the relationship between:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>True Positive Rate (TPR)</strong> or Sensitivity: Same as Recall - how many actual spam emails we catch</li>
                <li><strong>False Positive Rate (FPR)</strong> or 1-Specificity: How many legitimate emails we incorrectly mark as spam</li>
                <li>The diagonal line represents random guessing</li>
                <li>Better performance is shown by curves closer to the top-left corner</li>
                <li>The area under the curve (AUC) measures overall classifier performance:
                  <ul className="ml-4 mt-1">
                    <li>AUC = 1.0: Perfect classification</li>
                    <li>AUC = 0.5: No better than random guessing</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpamClassifierDemo;