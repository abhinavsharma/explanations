import { ArtifactStatus } from '@/components/artifact-wrapper';
import React, { useState, useEffect, useRef } from 'react';
import { ScatterChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

interface System1Category {
  name: string;
  emojis: string[];
  type: 'system1';
}

interface System2Category {
  name: string;
  choices: {
    text: string;
    answer: string;
  }[];
  type: 'system2';
}

type Category = System1Category | System2Category;

interface DataPoint {
  options: number;
  logOptions: number;
  time: number;
  choice: string;
  category: string;
  trial: number;
  allOptions: string[];
  system: 'system1' | 'system2';
}

interface SystemAverages {
  system1: { [key: string]: number };
  system2: { [key: string]: number };
}

export const artifactStatus = ArtifactStatus.UNPUBLISHED;

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
  };

const HicksLawDemo = () => {
  // States for the app
  const [started, setStarted] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<any[]>([]);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [category, setCategory] = useState<Category>({ name: '', emojis: [], type: 'system1' });
  const [bestFitLine, setBestFitLine] = useState<any[]>([]);
  const [systemMode, setSystemMode] = useState<'system1' | 'system2'>('system1');
  const [systemAverages, setSystemAverages] = useState<SystemAverages>({ system1: {}, system2: {} });
  
  // Ref to track component mount state
  const isMounted = useRef(true);
  
  // Define emoji categories (System 1)
  const system1Categories: System1Category[] = [
    {
      name: "Foods",
      emojis: ["🍎", "🍌", "🍕", "🍔", "🍦", "🍩", "🍗", "🍫", "🥑", "🍇", "🥭", "🍒"],
      type: 'system1'
    },
    {
      name: "Animals",
      emojis: ["🐶", "🐱", "🐭", "🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐯", "🦒", "🐘"],
      type: 'system1'
    },
    {
      name: "Sports",
      emojis: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎯", "🏓", "🏸", "🥊", "⛷️"],
      type: 'system1'
    },
    {
      name: "Travel",
      emojis: ["🚗", "🚕", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚲", "✈️", "🚢", "🚀"],
      type: 'system1'
    },
    {
      name: "Weather",
      emojis: ["☀️", "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️", "❄️", "🌪️"],
      type: 'system1'
    },
    {
      name: "Emotions",
      emojis: ["😀", "😂", "🥰", "😎", "🤔", "😴", "😭", "😱", "🤯", "😤", "🥳", "😇"],
      type: 'system1'
    },
    {
      name: "Activities",
      emojis: ["🏄", "🚴", "🧗", "🏋️", "🎮", "🎨", "📚", "🎭", "🎬", "🎤", "🧩", "🎯"],
      type: 'system1'
    },
    {
      name: "Plants",
      emojis: ["🌵", "🌲", "🌴", "🌱", "🌿", "☘️", "🍀", "🌺", "🌻", "🌹", "🌷", "🌸"],
      type: 'system1'
    },
    {
      name: "Fantasy",
      emojis: ["🧙", "🧝", "🧚", "🦄", "🐉", "🧟", "👻", "👽", "🦸", "🧞", "🧜", "🔮"],
      type: 'system1'
    },
    {
      name: "Technology",
      emojis: ["📱", "💻", "🖥️", "🎮", "🎧", "📸", "📺", "⌚", "💾", "🖨️", "💿", "🔋"],
      type: 'system1'
    }
  ];

  // Define text-based categories (System 2)
  const system2Categories: System2Category[] = [
    {
      name: "Simple Math",
      type: 'system2',
      choices: [
        { text: "23 × 3 vs 75", answer: "23 × 3" },
        { text: "15 + 27 vs 44", answer: "15 + 27" },
        { text: "91 - 16 vs 73", answer: "91 - 16" },
        { text: "48 ÷ 6 vs 9", answer: "48 ÷ 6" },
        { text: "17 + 38 vs 52", answer: "17 + 38" },
        { text: "31 × 2 vs 65", answer: "31 × 2" },
        { text: "84 - 29 vs 57", answer: "84 - 29" },
        { text: "72 ÷ 8 vs 8", answer: "72 ÷ 8" },
        { text: "45 + 19 vs 62", answer: "45 + 19" },
        { text: "13 × 4 vs 50", answer: "13 × 4" }
      ]
    },
    {
      name: "Word Definitions",
      type: 'system2',
      choices: [
        { text: "Excessive pride: hubris or torpor?", answer: "hubris" },
        { text: "State of confusion: stupor or vigor?", answer: "stupor" },
        { text: "Deep hatred: rancor or pallor?", answer: "rancor" },
        { text: "Formal complaint: grievance or reverence?", answer: "grievance" },
        { text: "Brief summary: précis or thesis?", answer: "précis" },
        { text: "Strong desire: fervor or tremor?", answer: "fervor" },
        { text: "Absolute ruler: despot or escort?", answer: "despot" },
        { text: "Sacred object: relic or ethic?", answer: "relic" },
        { text: "Verbal attack: tirade or charade?", answer: "tirade" },
        { text: "State of balance: poise or noise?", answer: "poise" }
      ]
    },
    {
      name: "Logical Statements",
      type: 'system2',
      choices: [
        { text: "If A>B and B>C, which is larger: A or C?", answer: "A" },
        { text: "If X=Y+2 and Y=Z+1, which is larger: X or Z?", answer: "X" },
        { text: "If P implies Q and Q is false, is P true or false?", answer: "false" },
        { text: "If all A are B and no B are C, can any A be C?", answer: "no" },
        { text: "If not (P or Q) is true, can P be true?", answer: "no" },
        { text: "If X≠Y and Y≠Z, must X≠Z?", answer: "no" },
        { text: "If A⊂B and B⊂C, is A⊂C true or false?", answer: "true" },
        { text: "If P→Q and Q→R, does P→R?", answer: "true" },
        { text: "If X+Y>10 and Y<3, is X>7 true or false?", answer: "true" },
        { text: "If not A = B, is A = not B true or false?", answer: "false" }
      ]
    }
  ];
  
  // Start the experiment
  const startExperiment = () => {
    setStarted(true);
    setDataPoints([]);
    setBestFitLine([]);
    showNextOptions();
  };
  
  // Show the next set of options
  const showNextOptions = () => {
    // Choose categories based on current system mode
    const categories = systemMode === 'system1' ? system1Categories : system2Categories;
    
    // Randomly select a category
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    setCategory(randomCategory);
    
    // Randomly decide how many options to show (between 2 and 9)
    const optionCount = Math.floor(Math.random() * 8) + 2;
    
    // Shuffle and select options based on system mode
    const options = randomCategory.type === 'system1'
      ? [...randomCategory.emojis].sort(() => 0.5 - Math.random()).slice(0, optionCount)
      : [...randomCategory.choices].sort(() => 0.5 - Math.random()).slice(0, optionCount);
    
    setCurrentOptions(options);
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
  const handleSelection = (choice) => {
    const endTime = performance.now();
    const reactionTime = (endTime - startTime) / 1000; // in seconds
    
    // Create new data point
    const newDataPoint = {
      options: currentOptions.length,
      logOptions: Math.log2(currentOptions.length),
      time: reactionTime,
      choice: choice,
      category: category.name,
      trial: dataPoints.length + 1,
      allOptions: [...currentOptions], // Store all options that were presented
      system: systemMode
    };
    
    // Add new data point
    setDataPoints(prev => [...prev, newDataPoint]);
    
    // Update system averages
    updateSystemAverages([...dataPoints, newDataPoint]);
    
    // Update the best fit line explicitly
    if (dataPoints.length >= 1) {
      const newLineData = getHicksLawLineWithData([...dataPoints, newDataPoint]);
      setBestFitLine(newLineData);
    }
    
    // Go to next round
    showNextOptions();
  };
  
  // Calculate and update system averages
  const updateSystemAverages = (points: DataPoint[]) => {
    const system1Points = points.filter(p => p.system === 'system1');
    const system2Points = points.filter(p => p.system === 'system2');
    
    const averages: SystemAverages = {
      system1: {},
      system2: {}
    };
    
    // Calculate averages for each number of options
    [system1Points, system2Points].forEach((systemPoints, idx) => {
      const systemKey = idx === 0 ? 'system1' : 'system2';
      
      // Group by number of options
      const groupedByOptions = systemPoints.reduce<{ [key: string]: number[] }>((acc, point) => {
        const key = point.options.toString();
        acc[key] = acc[key] || [];
        acc[key].push(point.time);
        return acc;
      }, {});
      
      // Calculate averages
      Object.entries(groupedByOptions).forEach(([options, times]) => {
        const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
        averages[systemKey][options] = avg;
      });
    });
    
    setSystemAverages(averages);
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
  const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload || !payload[0]) return null;
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow-sm">
        <p><strong>Options:</strong> {data.options}</p>
        <p><strong>Time:</strong> {data.time ? data.time.toFixed(2) : data.y.toFixed(2)} seconds</p>
        {data.choice && <p><strong>Selected:</strong> {data.choice} ({data.category})</p>}
      </div>
    );
  };
  
  // Render the component
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Explanation Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-3 dark:text-white">Hick's Law Interactive Demonstration</h1>
        <div className="text-gray-700 dark:text-gray-300 mb-4">
          <p className="mb-2">
            <strong>Hick's Law</strong> (or the Hick-Hyman Law) is a psychological principle that describes 
            the relationship between the number of choices presented and the time it takes to make a decision.
          </p>
          <p className="mb-2">
            This demonstration compares decision-making between two cognitive modes:
          </p>
          <ul className="list-disc pl-6 mt-1 mb-4">
            <li><strong>System 1</strong>: Fast, intuitive, and emotional decisions (visual choices)</li>
            <li><strong>System 2</strong>: Slow, logical, and analytical decisions (text-based problems)</li>
          </ul>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setSystemMode('system1')}
              className={`px-4 py-2 rounded-lg font-medium ${
                systemMode === 'system1'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              System 1 Mode
            </button>
            <button
              onClick={() => setSystemMode('system2')}
              className={`px-4 py-2 rounded-lg font-medium ${
                systemMode === 'system2'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              System 2 Mode
            </button>
          </div>
        </div>
        
        <button 
          onClick={started ? () => setStarted(false) : startExperiment}
          className={`mt-2 ${started ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium py-2 px-4 rounded`}
        >
          {started ? 'Stop Experiment' : 'Start Experiment'} (Space)
        </button>
      </div>
      
      {/* Options Section */}
      {started && (
        <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">
            {systemMode === 'system1' ? (
              <>Choose your favorite {category.name} emoji (press 1-{currentOptions.length} or click):</>
            ) : (
              <>Solve this {category.name} problem (press 1-{currentOptions.length} or click):</>
            )}
          </h2>
          <div className="flex flex-row flex-wrap gap-4">
            {currentOptions.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleSelection(systemMode === 'system1' ? choice : choice.text)}
                className={`${
                  systemMode === 'system1'
                    ? 'text-4xl'
                    : 'text-sm p-4 max-w-[250px]'
                } bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 p-2 rounded-lg shadow transition relative flex-shrink-0`}
                aria-label={`${systemMode === 'system1' ? choice : choice.text} option ${index + 1}`}
              >
                {systemMode === 'system1' ? choice : choice.text}
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
          <div className="mb-6 border border-gray-200 dark:border-gray-600 rounded-lg p-2">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Reaction Time (seconds)</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-1"></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">System 1</p>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-1"></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">System 2</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="x" 
                  type="number" 
                  name="Options"
                  domain={[0, 10]}
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
                <Tooltip content={<CustomTooltip />} />
                
                {/* Scatter plots for each system */}
                <Scatter 
                  name="System 1" 
                  data={getScatterData().filter(d => d.system === 'system1')} 
                  fill="#3B82F6"
                  isAnimationActive={false}
                />
                <Scatter 
                  name="System 2" 
                  data={getScatterData().filter(d => d.system === 'system2')} 
                  fill="#22C55E"
                  isAnimationActive={false}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          {/* System Averages Table */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 dark:text-white">Average Response Times by System</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left dark:text-white">Number of Options</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left dark:text-white">System 1 Avg (sec)</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left dark:text-white">System 2 Avg (sec)</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left dark:text-white">Difference (sec)</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(new Set([
                    ...Object.keys(systemAverages.system1),
                    ...Object.keys(systemAverages.system2)
                  ]).values()).sort((a, b) => Number(a) - Number(b)).map(options => {
                    const sys1Avg = systemAverages.system1[options] || 0;
                    const sys2Avg = systemAverages.system2[options] || 0;
                    const diff = sys2Avg - sys1Avg;
                    return (
                      <tr key={options} className="even:bg-gray-50 dark:even:bg-gray-700">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 dark:text-gray-300">{options}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 dark:text-gray-300">
                          {sys1Avg ? sys1Avg.toFixed(3) : '-'}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 dark:text-gray-300">
                          {sys2Avg ? sys2Avg.toFixed(3) : '-'}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 dark:text-gray-300">
                          {(sys1Avg && sys2Avg) ? diff.toFixed(3) : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HicksLawDemo;