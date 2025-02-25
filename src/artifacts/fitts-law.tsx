import React, { useState, useEffect, useRef } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArtifactStatus } from '@/components/artifact-wrapper';

export const artifactStatus = ArtifactStatus.PUBLISHED;

const LOCAL_STORAGE_KEY = 'fitts-law-results';

const FittsLawDemo = () => {
  const [stage, setStage] = useState('active'); // active or paused
  const [trials, setTrials] = useState([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [mousePositions, setMousePositions] = useState([]);
  const [showPath, setShowPath] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [targetDwellStart, setTargetDwellStart] = useState(null);
  const [targetDwellCountdown, setTargetDwellCountdown] = useState(null);
  const [targetReached, setTargetReached] = useState(false);
  const containerRef = useRef(null);
  const startPositionRef = useRef(null);
  const targetRef = useRef(null);

  // Load saved results from localStorage
  useEffect(() => {
    const savedResults = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  // Save results to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(results));
  }, [results]);

  // Generate a single new trial
  const generateNewTrial = () => {
    const containerWidth = 600;
    const containerHeight = 400;
    const startX = 50;
    const startY = containerHeight / 2;
    const startSize = 40;
    
    // Vary target size between 25px and 60px
    const size = 25 + Math.floor(Math.random() * 36);
    
    // Vary target position
    const targetX = 150 + Math.floor(Math.random() * (containerWidth - 200));
    const targetY = 50 + Math.floor(Math.random() * (containerHeight - 100));
    
    // Calculate actual distance between points
    const distance = Math.sqrt(
      Math.pow(targetX - startX, 2) + 
      Math.pow(targetY - startY, 2)
    );
    
    return {
      startX,
      startY,
      startSize,
      targetX,
      targetY,
      size,
      distance
    };
  };

  // Initialize or reset the test
  const resetTest = (clearData = false) => {
    const newTrial = generateNewTrial();
    setTrials([newTrial]);
    if (clearData) {
      setResults([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setCurrentTrialIndex(0);
    setMousePositions([]);
    setStage('active');
  };

  const handleStartEnter = () => {
    setIsHovering(true);
    setCountdown(3);
  };

  const handleStartLeave = () => {
    setIsHovering(false);
    setCountdown(null);
  };

  const handleTargetEnter = () => {
    if (stage === 'active' && startTime) {
      if (!targetReached) {
        // Record when the user first reached the target
        setTargetReached(true);
        setTargetDwellStart(performance.now());
        setTargetDwellCountdown(0.5); // Half-second dwell time
      }
    }
  };
  
  const handleTargetLeave = () => {
    if (targetReached && targetDwellCountdown !== null) {
      // User left the target before completing the dwell time
      setTargetReached(false);
      setTargetDwellStart(null);
      setTargetDwellCountdown(null);
    }
  };

  // Custom hit detection for circular targets
  const isMouseInCircle = (e, centerX, centerY, radius) => {
    if (!containerRef.current) return false;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const distanceSquared = Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2);
    return distanceSquared <= Math.pow(radius, 2);
  };
  
  // Track mouse movement with custom hit detection
  const handleMouseMove = (e) => {
    // Track mouse positions for path drawing - only when moving toward target
    if (startTime && stage === 'active' && containerRef.current && !targetReached) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMousePositions(prev => [...prev, { x, y, timestamp: performance.now() }]);
    }
    
    // Check if mouse is over target (custom hit detection)
    if (stage === 'active' && startTime && trials[currentTrialIndex]) {
      const trial = trials[currentTrialIndex];
      const isInTarget = isMouseInCircle(e, trial.targetX, trial.targetY, trial.size / 2);
      
      if (isInTarget && !targetReached) {
        // Entered target
        handleTargetEnter();
      } else if (!isInTarget && targetReached) {
        // Left target
        handleTargetLeave();
      }
    }
    
    // Check if mouse is over start position (only when not started)
    if (!startTime && trials[currentTrialIndex]) {
      const trial = trials[currentTrialIndex];
      const isInStart = isMouseInCircle(e, trial.startX, trial.startY, trial.startSize / 2);
      
      if (isInStart && !isHovering) {
        handleStartEnter();
      } else if (!isInStart && isHovering) {
        handleStartLeave();
      }
    }
  };
  
  // Process successful target acquisition
  const completeTargetAcquisition = () => {
    const currentTrial = trials[currentTrialIndex];
    
    // Calculate time from start to first target reach
    const timeInMs = targetDwellStart - startTime;
    const ID = Math.log2(currentTrial.distance / currentTrial.size + 1);
    
    const newResults = [...results, {
      trial: results.length + 1,
      distance: currentTrial.distance,
      size: currentTrial.size,
      time: timeInMs,
      ID
    }];
    
    setResults(newResults);
    setTargetReached(false);
    setTargetDwellStart(null);
    setTargetDwellCountdown(null);
    
    // Generate next trial
    const nextTrial = generateNewTrial();
    setTrials([...trials, nextTrial]);
    setCurrentTrialIndex(currentTrialIndex + 1);
    setStartTime(null);
  };

  // Calculate Fitts' Law prediction with trend line
  const calculateFittsLaw = () => {
    if (results.length < 2) return { data: [], regression: null };
    
    // For Fitts' Law, we need to transform the ratio to ID (index of difficulty)
    const ids = results.map(r => Math.log2(r.distance / r.size + 1));
    const times = results.map(r => r.time);
    
    const n = ids.length;
    const sumX = ids.reduce((sum, x) => sum + x, 0);
    const sumY = times.reduce((sum, y) => sum + y, 0);
    const sumXY = ids.reduce((sum, x, i) => sum + x * times[i], 0);
    const sumXX = ids.reduce((sum, x) => sum + x * x, 0);
    
    // Calculate slope (b) and intercept (a) for Fitts' Law: MT = a + b * log2(D/S + 1)
    const b = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const a = (sumY - b * sumX) / n;
    
    // Calculate R-squared
    const meanY = sumY / n;
    const totalVariance = times.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0);
    
    // Calculate predicted values and residuals
    const predictedTimes = ids.map(id => a + b * id);
    const residualVariance = times.reduce((sum, y, i) => sum + Math.pow(y - predictedTimes[i], 2), 0);
    
    // R-squared = 1 - (residual variance / total variance)
    const rSquared = 1 - (residualVariance / totalVariance);
    
    // Return data with original points and prediction line points
    const data = results.map((result, i) => ({
      ...result,
      ratio: result.distance / result.size,
      id: ids[i],
      predictedTime: predictedTimes[i]
    }));
    
    // Add min and max points to make sure the line spans the chart
    const minRatio = Math.min(...data.map(d => d.ratio));
    const maxRatio = Math.max(...data.map(d => d.ratio));
    const padding = (maxRatio - minRatio) * 0.2;
    
    // Create line points using the actual ratio but calculated through ID
    const linePoints = [];
    for (let i = 0; i <= 10; i++) {
      const ratio = minRatio + (i / 10) * (maxRatio - minRatio + 2 * padding);
      const id = Math.log2(ratio + 1);
      linePoints.push({
        ratio,
        predictedTime: a + b * id
      });
    }
    
    // Add regression info for display
    return {
      data,
      regression: {
        a,
        b,
        rSquared,
        linePoints
      }
    };
  };

  // Get model quality
  const getModelQuality = () => {
    const analysis = calculateFittsLaw();
    if (!analysis || !analysis.regression) return 0;
    return Math.max(0, Math.min(100, analysis.regression.rSquared * 100));
  };

  useEffect(() => {
    // Initialize on first render
    if (trials.length === 0) {
      resetTest();
    }
  }, []);

  useEffect(() => {
    // Countdown logic
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setStartTime(performance.now());
      setMousePositions([]);
      setCountdown(null);
    }
  }, [countdown]);
  
  // Handle dwell countdown
  useEffect(() => {
    if (targetDwellCountdown !== null && targetDwellCountdown > 0) {
      const timer = setTimeout(() => {
        setTargetDwellCountdown(targetDwellCountdown - 0.1);
      }, 100);
      
      return () => clearTimeout(timer);
    } else if (targetDwellCountdown !== null && targetDwellCountdown <= 0) {
      // Dwell time completed, process the target acquisition
      completeTargetAcquisition();
    }
  }, [targetDwellCountdown]);
  
  useEffect(() => {
    // Reset hover state and clear path when trial changes
    setIsHovering(false);
    setMousePositions([]);
  }, [currentTrialIndex]);

  const renderStartPosition = () => {
    const trial = trials[currentTrialIndex];
    if (!trial) return null;
    
    const style = {
      width: `${trial.startSize}px`,
      height: `${trial.startSize}px`,
      borderRadius: '50%',
      position: 'absolute',
      left: `${trial.startX - trial.startSize/2}px`,
      top: `${trial.startY - trial.startSize/2}px`,
      backgroundColor: isHovering ? '#f1c40f' : '#3498db',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s'
    };

    return (
      <div
        ref={startPositionRef}
        style={style}
      >
        {countdown !== null ? countdown : "Start"}
      </div>
    );
  };

  const renderTarget = () => {
    const trial = trials[currentTrialIndex];
    if (!trial) return null;
    
    // Different background based on target state
    let backgroundColor = 'transparent';
    let text = "";
    
    if (startTime) {
      if (!targetReached) {
        backgroundColor = 'rgba(231, 76, 60, 0.3)';
        text = "Target";
      } else {
        // Show dwell countdown progress
        backgroundColor = 'rgba(39, 174, 96, 0.5)';
        text = targetDwellCountdown !== null ? 
          targetDwellCountdown.toFixed(1) + "s" : "Hold";
      }
    }
    
    const style = {
      width: `${trial.size}px`,
      height: `${trial.size}px`,
      borderRadius: '50%',
      position: 'absolute',
      left: `${trial.targetX - trial.size/2}px`,
      top: `${trial.targetY - trial.size/2}px`,
      border: targetReached ? '2px solid #27ae60' : '2px solid #e74c3c',
      backgroundColor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '14px',
      fontWeight: 'bold',
      color: targetReached ? '#27ae60' : '#e74c3c',
      transition: 'background-color 0.3s, border-color 0.3s, color 0.3s'
    };

    return (
      <div
        ref={targetRef}
        style={style}
      >
        {text}
      </div>
    );
  };

  const renderMousePath = () => {
    if (!showPath || mousePositions.length === 0) return null;
    
    return mousePositions.map((pos, index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: '2px',
          height: '2px',
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
          borderRadius: '50%'
        }}
      />
    ));
  };

  const renderTestArea = () => (
    <div
      ref={containerRef}
      className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded relative overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ 
        width: '100%', 
        maxWidth: '800px',
        height: '400px',
        border: '3px solid var(--border-color, #34495e)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        margin: '0 auto'
      }}
    >
      {renderStartPosition()}
      {renderTarget()}
      {renderMousePath()}
    </div>
  );

  const renderTrialStatus = () => {
    let statusText = 'Hover over the blue circle to start';
    
    if (startTime) {
      if (!targetReached) {
        statusText = 'Move to the target!';
      } else {
        statusText = 'Hold steady in the target!';
      }
    }
    
    return (
      <div className="mb-4 text-left">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {statusText}
            </p>
          </div>
          <button
            onClick={() => resetTest(true)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
          >
            Reset Data
          </button>
        </div>
      </div>
    );
  };

  const renderResultGraph = () => {
    const hasEnoughData = results.length >= 2;
    
    if (!hasEnoughData) {
      return (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-left text-gray-900 dark:text-gray-100">Real-time Results</h3>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 h-64 rounded flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400">Complete more trials to see your results</p>
          </div>
        </div>
      );
    }
    
    // Only calculate if we have enough data
    const analysis = calculateFittsLaw();
    const quality = getModelQuality();
    
    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-left text-gray-900 dark:text-gray-100">Real-time Results</h3>
        </div>
        
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded mb-4">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Model Fit (R²): {quality.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This shows how well your data fits the predicted logarithmic relationship
          </p>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
              className="dark:text-gray-100"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color, #666)" />
              <XAxis 
                type="number" 
                dataKey="ratio" 
                name="Distance/Size Ratio" 
                label={{ value: 'Distance/Size Ratio', position: 'bottom', fill: 'var(--text-color, #333)' }}
                domain={[0, 'dataMax + 2']}
                stroke="var(--text-color, #333)"
              />
              <YAxis 
                type="number" 
                dataKey="time" 
                name="Movement Time" 
                label={{ value: 'Movement Time (ms)', angle: -90, position: 'left', fill: 'var(--text-color, #333)' }}
                domain={[0, 'dataMax + 200']}
                stroke="var(--text-color, #333)"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg, #fff)',
                  border: '1px solid var(--border-color, #ccc)',
                  color: 'var(--text-color, #333)'
                }}
                formatter={(value, name) => {
                  return name === 'predictedTime' 
                    ? [Math.round(value) + ' ms', 'Predicted Time'] 
                    : [Math.round(value) + ' ms', 'Your Time'];
                }}
                labelFormatter={(value) => `Distance/Size Ratio: ${value.toFixed(2)}`}
              />
              <Scatter 
                name="Your Time" 
                data={analysis.data} 
                fill="var(--scatter-color, #3498db)" 
              />
              <Scatter 
                name="Trend Line" 
                data={analysis.regression.linePoints} 
                dataKey="predictedTime"
                line
                lineType="joint"
                fill="none"
                stroke="var(--trend-line-color, #e74c3c)"
                strokeWidth={2}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="top" 
                align="center" 
                wrapperStyle={{ paddingLeft: 30 }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderFittsLawInfo = () => {
    const analysis = calculateFittsLaw();
    const modelParams = analysis.regression || { a: 0, b: 0 };
    
    return (
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">About Fitts' Law</h3>
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          Fitts' Law is a claim in human-computer interaction that predicts how long it takes to move to and select a target. The equation is given by:
        </p>
        <div className="p-3 bg-white dark:bg-gray-700 rounded mb-1 font-mono text-center text-gray-900 dark:text-gray-100">
          Time = a + b × log₂(Distance/Size + 1)
        </div>

        <div>Try this interactive demo to see how target size and distance affect movement time. </div>
        {results.length >= 2 && (
          <div className="p-2 mb-3 text-center text-sm text-gray-700 dark:text-gray-300">
            Your model parameters: a = {modelParams.a.toFixed(1)}ms, b = {modelParams.b.toFixed(1)}ms/bit
          </div>
        )}
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          On the chart, we've plotted the Distance/Size ratio against movement time, with a curve
          showing the logarithmic relationship predicted by Fitts' Law. 
        </p>
      </div>
    );
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-left text-gray-900 dark:text-gray-100">Fitts' Law</h2>
      
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Fitts' Law is a fundamental principle in human-computer interaction that predicts how long it takes to move to and select a target. Try this interactive demo to see how target size and distance affect movement time. The formal equation is given by:
        Time = a + b × log₂(Distance/Size + 1)
      </p>

      <div className="flex flex-col gap-6 w-full">
        <div className="w-full">
          {renderTrialStatus()}
          {renderTestArea()}
        </div>
        
        <div className="w-full">
          {renderResultGraph()}
        </div>
      </div>
      
      {renderFittsLawInfo()}
    </div>
  );
};

export default FittsLawDemo;