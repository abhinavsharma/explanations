import { ArtifactStatus } from '@/components/artifact-wrapper';

export const artifactStatus = ArtifactStatus.PUBLISHED;// Create stand-alone line data for the model curve with explicit data argument
const getHicksLawLineWithData = (data) => {
    if (!data || data.length < 2) {
      console.log("Not enough data points for curve");
      return [];
    }
    
    // Calculate model parameters based on provided data
    const { a, b } = getModelParamsForData(data);
    console.log(`Model parameters: a=${a.toFixed(3)}, b=${b.toFixed(3)}`);
    
    // Create an array of points for the line with small steps for smoothness
    const lineData = [];
    for (let i = 0; i <= 45; i++) {
      const x = 1 + (i * 0.2); // From 1 to 10 in steps of 0.2
      const logValue = x <= 1 ? 0 : Math.log2(x);
      const y = a + b * logValue;
      
      lineData.push({ x, y });
    }
    
    console.log(`Generated ${lineData.length} curve points from x=${lineData[0].x.toFixed(1)} to x=${lineData[lineData.length-1].x.toFixed(1)}`);
    return lineData;
  };
  
  // Calculate model parameters for explicitly provided data
  const getModelParamsForData = (data) => {
    if (!data || data.length < 2) return { a: 0, b: 0 };
    
    // Filter out any points where options <= 1
    const validPoints = data.filter(point => point.options > 1);
    
    if (validPoints.length < 2) {
      // If we don't have enough valid points, use a simple default model
      return { a: 0.5, b: 0.3 }; 
    }
    
    // Calculate means of log2(n) and reaction time
    const meanLog = validPoints.reduce((sum, point) => sum + Math.log2(point.options), 0) / validPoints.length;
    const meanTime = validPoints.reduce((sum, point) => sum + point.time, 0) / validPoints.length;
    
    // Calculate slope (b)
    let numerator = 0;
    let denominator = 0;
    
    validPoints.forEach(point => {
      const logValue = Math.log2(point.options);
      numerator += (logValue - meanLog) * (point.time - meanTime);
      denominator += (logValue - meanLog) ** 2;
    });
    
    const b = denominator !== 0 ? numerator / denominator : 0.3; // Default if calculation fails
    const a = meanTime - b * meanLog;
    
    // Ensure reasonable values (fallback to defaults if something goes wrong)
    return { 
      a: isNaN(a) || !isFinite(a) ? 0.5 : a, 
      b: isNaN(b) || !isFinite(b) ? 0.3 : b
    };
  };import React, { useState, useEffect, useRef } from 'react';
import { ScatterChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const HicksLawDemo = () => {
  // States for the app
  const [started, setStarted] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [dataPoints, setDataPoints] = useState(() => {
    // Initialize from localStorage if available
    const savedData = localStorage.getItem('hicksLawData');
    return savedData ? JSON.parse(savedData) : [];
  });
  const [startTime, setStartTime] = useState(null);
  const [category, setCategory] = useState({});
  const [bestFitLine, setBestFitLine] = useState([]);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hicksLawData', JSON.stringify(dataPoints));
  }, [dataPoints]);
  
  // Ref to track component mount state
  const isMounted = useRef(true);
  
  // Define emoji categories
  const emojiCategories = [
    {
      name: "Foods",
      emojis: ["🍎", "🍌", "🍕", "🍔", "🍦", "🍩", "🍗", "🍫", "🥑", "🍇", "🥭", "🍒"]
    },
    {
      name: "Animals",
      emojis: ["🐶", "🐱", "🐭", "🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐯", "🦒", "🐘"]
    },
    {
      name: "Sports",
      emojis: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎯", "🏓", "🏸", "🥊", "⛷️"]
    },
    {
      name: "Travel",
      emojis: ["🚗", "🚕", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚲", "✈️", "🚢", "🚀"]
    },
    {
      name: "Weather",
      emojis: ["☀️", "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️", "❄️", "🌪️"]
    },
    {
      name: "Emotions",
      emojis: ["😀", "😂", "🥰", "😎", "🤔", "😴", "😭", "😱", "🤯", "😤", "🥳", "😇"]
    },
    {
      name: "Activities",
      emojis: ["🏄", "🚴", "🧗", "🏋️", "🎮", "🎨", "📚", "🎭", "🎬", "🎤", "🧩", "🎯"]
    },
    {
      name: "Plants",
      emojis: ["🌵", "🌲", "🌴", "🌱", "🌿", "☘️", "🍀", "🌺", "🌻", "🌹", "🌷", "🌸"]
    },
    {
      name: "Fantasy",
      emojis: ["🧙", "🧝", "🧚", "🦄", "🐉", "🧟", "👻", "👽", "🦸", "🧞", "🧜", "🔮"]
    },
    {
      name: "Technology",
      emojis: ["📱", "💻", "🖥️", "🎮", "🎧", "📸", "📺", "⌚", "💾", "🖨️", "💿", "🔋"]
    }
  ];
  
  // Start the experiment
  const startExperiment = () => {
    setStarted(true);
    showNextOptions();
  };
  
  // Reset the experiment
  const resetExperiment = () => {
    if (window.confirm('Are you sure you want to reset? This will clear all your collected data.')) {
      setStarted(false);
      setDataPoints([]);
      setBestFitLine([]);
      localStorage.removeItem('hicksLawData');
    }
  };
  
  // Show the next set of options
  const showNextOptions = () => {
    // Randomly select a category
    const randomCategory = emojiCategories[Math.floor(Math.random() * emojiCategories.length)];
    setCategory(randomCategory);
    
    // Randomly decide how many options to show (between 2 and 9)
    const optionCount = Math.floor(Math.random() * 8) + 2; // 2 to 9 options for keyboard shortcuts 1-9
    
    // Shuffle and select emojis
    const shuffled = [...randomCategory.emojis].sort(() => 0.5 - Math.random());
    const selectedEmojis = shuffled.slice(0, optionCount);
    
    setCurrentOptions(selectedEmojis);
    setStartTime(performance.now());
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!started) return;
      
      // Check if key pressed is a number between 1-9
      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= 9) {
        // Check if this option exists in current options (1-indexed for user, 0-indexed for array)
        if (num <= currentOptions.length) {
          handleSelection(currentOptions[num-1]);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [started, currentOptions]);
  
  // Add keyboard shortcut for starting/stopping experiment
  useEffect(() => {
    const handleSpacebar = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault(); // Prevent page scroll
        started ? setStarted(false) : startExperiment();
      }
    };

    window.addEventListener('keydown', handleSpacebar);
    return () => window.removeEventListener('keydown', handleSpacebar);
  }, [started]); // Only re-run if started state changes
  
  // Handle user selection
  const handleSelection = (emoji) => {
    const endTime = performance.now();
    const reactionTime = (endTime - startTime) / 1000; // in seconds
    
    // Create new data point
    const newDataPoint = {
      options: currentOptions.length,
      logOptions: Math.log2(currentOptions.length),
      time: reactionTime,
      emoji: emoji,
      category: category.name,
      trial: dataPoints.length + 1,
      allOptions: [...currentOptions] // Store all options that were presented
    };
    
    // Add new data point (force re-render with new array reference)
    setDataPoints(prev => [...prev, newDataPoint]);
    
    // Update the best fit line explicitly
    if (dataPoints.length >= 1) { // We'll have 2+ points after this addition
      const newLineData = getHicksLawLineWithData([...dataPoints, newDataPoint]);
      setBestFitLine(newLineData);
    }
    
    // Go to next round
    showNextOptions();
  };
  
  // Calculate model parameters using linear regression on log-transformed data
  const getModelParams = () => {
    if (dataPoints.length < 2) return { a: 0, b: 0 };
    
    // Filter out any points where options <= 1 (since log(1) = 0 and log values less than 1 are negative)
    const validPoints = dataPoints.filter(point => point.options > 1);
    
    if (validPoints.length < 2) {
      // If we don't have enough valid points, use a simple default model
      return { a: 0.5, b: 0.3 }; 
    }
    
    // Calculate means of log2(n) and reaction time
    const meanLog = validPoints.reduce((sum, point) => sum + Math.log2(point.options), 0) / validPoints.length;
    const meanTime = validPoints.reduce((sum, point) => sum + point.time, 0) / validPoints.length;
    
    // Calculate slope (b)
    let numerator = 0;
    let denominator = 0;
    
    validPoints.forEach(point => {
      const logValue = Math.log2(point.options);
      numerator += (logValue - meanLog) * (point.time - meanTime);
      denominator += (logValue - meanLog) ** 2;
    });
    
    const b = denominator !== 0 ? numerator / denominator : 0.3; // Default if calculation fails
    const a = meanTime - b * meanLog;
    
    // Ensure reasonable values (fallback to defaults if something goes wrong)
    return { 
      a: isNaN(a) || !isFinite(a) ? 0.5 : a, 
      b: isNaN(b) || !isFinite(b) ? 0.3 : b
    };
  };
  
  // Get formatted equation
  const getModelEquation = () => {
    const { a, b } = getModelParams();
    return { 
      a: a.toFixed(3), 
      b: b.toFixed(3) 
    };
  };
  
  // Create stand-alone line data for the model curve
  const getHicksLawLine = () => {
    if (dataPoints.length < 2) {
      console.log("Not enough data points for curve");
      return [];
    }
    
    const { a, b } = getModelParams();
    console.log(`Model parameters: a=${a.toFixed(3)}, b=${b.toFixed(3)}`);
    
    // Create an array of points for the line with smaller steps for smoothness
    const lineData = [];
    // Generate more points for a smoother curve, focusing on the lower range
    for (let i = 0; i <= 90; i++) {
      const x = 1 + (i * 0.1); // From 1 to 10 in steps of 0.1
      const logValue = Math.log2(x);
      const y = a + b * logValue;
      
      lineData.push({ x, y });
    }
    
    console.log(`Generated ${lineData.length} curve points from x=${lineData[0].x.toFixed(1)} to x=${lineData[lineData.length-1].x.toFixed(1)}`);
    return lineData;
  };
  
  // Create scatter plot data with explicit x/y coordinates
  const getScatterData = () => {
    return dataPoints.map(point => ({
      x: point.options,
      y: point.time,
      // Include all original properties for tooltip/details
      ...point
    }));
  };
  
  // Update bestFitLine whenever dataPoints changes
  useEffect(() => {
    if (dataPoints.length >= 2 && isMounted.current) {
      // Generate best fit line data
      const lineData = getHicksLawLine();
      setBestFitLine(lineData);
      
      // Log for debugging
      console.log(`Updated best fit line with ${lineData.length} points`);
    }
  }, [dataPoints]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-sm">
          <p><strong>Options:</strong> {data.options}</p>
          <p><strong>Time:</strong> {data.time ? data.time.toFixed(2) : data.y.toFixed(2)} seconds</p>
          {data.emoji && <p><strong>Selected:</strong> {data.emoji} ({data.category})</p>}
        </div>
      );
    }
    return null;
  };
  
  // Add CSV download function
  const downloadCSV = () => {
    // Define CSV headers
    const headers = [
      'Trial',
      'Number of Options',
      'Category',
      'Options Presented',
      'Selection',
      'Reaction Time (s)',
      'Log2(Options)',
    ];

    // Convert data points to CSV rows
    const rows = dataPoints.map(point => [
      point.trial,
      point.options,
      point.category,
      point.allOptions.join(' '),
      point.emoji,
      point.time.toFixed(3),
      Math.log2(point.options).toFixed(3)
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'hicks_law_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Calculate R-squared (coefficient of determination)
  const calculateRSquared = () => {
    if (dataPoints.length < 2) return 0;

    const { a, b } = getModelParams();
    
    // Calculate mean of observed values
    const meanY = dataPoints.reduce((sum, point) => sum + point.time, 0) / dataPoints.length;
    
    // Calculate total sum of squares (TSS) and residual sum of squares (RSS)
    let tss = 0;
    let rss = 0;
    
    dataPoints.forEach(point => {
      const predicted = a + b * Math.log2(point.options);
      tss += Math.pow(point.time - meanY, 2);
      rss += Math.pow(point.time - predicted, 2);
    });
    
    // R-squared = 1 - (RSS / TSS)
    const rSquared = Math.max(0, 1 - (rss / tss)); // Ensure non-negative
    return rSquared;
  };
  
  // Calculate median reaction times by number of options
  const getMedianReactionTimes = () => {
    const timesByOptions: { [key: string]: number[] } = {};
    
    // Group times by number of options
    dataPoints.forEach(point => {
      if (!timesByOptions[point.options]) {
        timesByOptions[point.options] = [];
      }
      timesByOptions[point.options].push(point.time);
    });

    // Calculate median for each group
    const medians = Object.entries(timesByOptions).map(([options, times]) => {
      // Sort times for this number of options
      const sortedTimes = [...times].sort((a, b) => a - b);
      const count = sortedTimes.length;
      
      // Calculate median
      const median = count % 2 === 0
        ? (sortedTimes[count/2 - 1] + sortedTimes[count/2]) / 2
        : sortedTimes[Math.floor(count/2)];
      
      return {
        options: parseInt(options),
        medianTime: median,
        count: count
      };
    });

    // Sort by number of options
    return medians.sort((a, b) => a.options - b.options);
  };
  
  // Render the component
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Explanation Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-3 dark:text-white">Hick's Law</h1>
        <div className="text-gray-700 dark:text-gray-300 mb-4">
          <p className="mb-2">
            <strong>Hick's Law</strong> (or the Hick-Hyman Law) is a psychological principle that describes 
            the relationship between the number of choices presented and the time it takes to make a decision.
          </p>
          <p className="mb-2">
            According to this law, decision time increases logarithmically with the number of available options.
            The formula is expressed as:
          </p>
          <p className="text-center font-medium my-3">
            T = a + b × log₂(n)
          </p>
          <p className="mb-2">
            Where:
          </p>
          <ul className="list-disc pl-6 mt-1">
            <li><strong>T</strong> = decision time</li>
            <li><strong>n</strong> = number of choices</li>
            <li><strong>a</strong> and <strong>b</strong> = constants that vary by task and individual</li>
          </ul>
          <p className="mt-3">
            This principle has important implications for user interface design, menu structures, and decision-making scenarios.
          </p>
        </div>
        
        <div className="flex gap-3 mb-4">
          <button 
            onClick={started ? () => setStarted(false) : startExperiment}
            className={`${started ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium py-2 px-4 rounded`}
          >
            {started ? 'Pause Experiment' : (dataPoints.length > 0 ? 'Resume Experiment' : 'Start Experiment')} (Space)
          </button>
          
          <button 
            onClick={resetExperiment}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
          >
            Clear Data
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-3 rounded">
          📝 <strong>Note:</strong> Your experiment data is automatically saved in your browser's local storage and will persist across sessions. 
          Use the Clear Data button above to explicitly clear your data if needed.
        </p>
      </div>
      
      {/* Options Section */}
      {started && (
        <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">
            {category.name}: Choose your favorite emoji (press 1-{currentOptions.length}):
          </h2>
          <div className="flex flex-row flex-nowrap overflow-x-auto gap-2 pb-2">
            {currentOptions.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleSelection(emoji)}
                className="text-4xl bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 p-2 rounded-lg shadow transition relative flex-shrink-0"
                aria-label={`${emoji} option ${index + 1}`}
              >
                {emoji}
                <span className="absolute top-1 left-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Results Chart */}
      {dataPoints.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Reaction Time vs. Number of Options</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Total data points: <strong>{dataPoints.length}</strong> | 
            Latest reaction time: <strong>{dataPoints.length > 0 ? dataPoints[dataPoints.length-1].time.toFixed(2) : "0.00"}</strong> seconds with 
            <strong> {dataPoints.length > 0 ? dataPoints[dataPoints.length-1].options : "0"}</strong> options
          </p>
          
          <div className="mb-6 border border-gray-200 dark:border-gray-600 rounded-lg p-2">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Reaction Time (seconds)</p>
              {dataPoints.length >= 2 && (
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-[#FF5733] mr-1"></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Best fit curve</p>
                </div>
              )}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="x" 
                  type="number" 
                  name="Options"
                  domain={[1, 10]}
                  allowDataOverflow={true}
                  xAxisId={0}
                  label={{ value: 'Number of Options', position: 'insideBottom', offset: -20 }}
                />
                <YAxis 
                  dataKey="y" 
                  type="number" 
                  name="Time"
                  yAxisId={0}
                  domain={[0, dataMax => Math.max(2, dataMax * 1.2)]}
                />
                <Tooltip content={CustomTooltip} />
                
                {/* Scatter plot of actual data points */}
                <Scatter 
                  name="Your Reaction Times" 
                  data={getScatterData()} 
                  fill="#8884d8"
                  isAnimationActive={false}
                />
                
                {/* Best fit curve */}
                {dataPoints.length >= 2 && bestFitLine.length > 0 && (
                  <Line
                    name="Hick's Law Model" 
                    data={bestFitLine}
                    type="monotone"
                    dataKey="y"
                    stroke="#FF5733"
                    strokeWidth={3}
                    dot={false}
                    activeDot={false}
                    isAnimationActive={false}
                    xAxisId={0}
                    yAxisId={0}
                  />
                )}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          
          
          {/* Median Reaction Times Histogram */}
          <div className="mt-8 mb-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Median Reaction Time by Number of Options</h3>
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-2">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={getMedianReactionTimes()} margin={{ top: 20, right: 30, left: 10, bottom: 35 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="options"
                    type="number"
                    name="Options"
                    label={{ value: 'Number of Options', position: 'insideBottom', offset: -20 }}
                  />
                  <YAxis
                    label={{ 
                      value: 'Median Reaction Time (s)', 
                      angle: -90, 
                      position: 'insideLeft',
                      offset: 10
                    }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-gray-800 dark:bg-gray-700 p-2 border border-gray-600 rounded shadow-lg text-white">
                            <p><strong>Options:</strong> {data.options}</p>
                            <p><strong>Median Time:</strong> {data.medianTime.toFixed(2)} seconds</p>
                            <p><strong>Samples:</strong> {data.count}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="medianTime"
                    fill="#8884d8"
                    name="Median Reaction Time"
                  >
                    {/* Add sample count labels on top of bars */}
                    {getMedianReactionTimes().map((entry, index) => (
                      <text
                        key={`label-${index}`}
                        x={0}
                        y={0}
                        dx={0}
                        dy={-10}
                        fill="#666"
                        fontSize={10}
                        textAnchor="middle"
                      >
                        n={entry.count}
                      </text>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Equation and Fit Quality */}
          {dataPoints.length >= 2 && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-center font-medium dark:text-white">
                Your Hick's Law Model: T = {getModelEquation().a} + {getModelEquation().b} × log₂(n) seconds
              </p>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                This model uses linear regression on log-transformed data to find the best-fitting parameters.
                The intercept (a) represents base reaction time, while the slope (b) indicates how much each doubling of options slows you down.
              </p>
              <div className="mt-3 flex flex-col items-center">
                <p className="text-sm font-medium dark:text-white">Model Fit Quality</p>
                <div className="w-full max-w-md h-4 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-300"
                    style={{ width: `${(calculateRSquared() * 100).toFixed(1)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  R² = {(calculateRSquared() * 100).toFixed(1)}% - {' '}
                  {calculateRSquared() > 0.8 ? 'Excellent fit!' : 
                   calculateRSquared() > 0.6 ? 'Good fit' : 
                   calculateRSquared() > 0.4 ? 'Moderate fit' : 'Poor fit'}.
                  <span className="block mt-1 text-xs">
                    (R² measures how well the model explains the variation in your reaction times)
                  </span>
                </p>
              </div>
            </div>
          )}
          
          {/* Data History Table */}
          {dataPoints.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold dark:text-white">Decision History</h3>
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
                >
                  <span>📊 Download CSV</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left dark:text-white">Trial</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left dark:text-white"># Options</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left dark:text-white">Category</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left dark:text-white">Options Presented</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left dark:text-white">Selection</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left dark:text-white">Time (sec)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPoints.map((point, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 dark:text-gray-300">{point.trial}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 dark:text-gray-300">{point.options}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 dark:text-gray-300">{point.category}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-lg whitespace-nowrap">{point.allOptions.join(' ')}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-xl">{point.emoji}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <span>{point.time.toFixed(3)}</span>
                            <div className="flex-grow h-4 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-300"
                                style={{ width: `${Math.min(100, (point.time / 2) * 100)}%` }}
                                title={`${point.time.toFixed(3)} seconds`}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HicksLawDemo;