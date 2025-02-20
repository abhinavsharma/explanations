import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Square, ChevronDown, ChevronUp, Lock, Play } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../components/theme-provider';
import { ArtifactStatus } from '@/components/artifact-wrapper';

export const artifactStatus = ArtifactStatus.PUBLISHED;

const MontyHallGame = () => {
  // Game state
  const [doors, setDoors] = useState([]);
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [revealedDoor, setRevealedDoor] = useState(null);
  const [gameState, setGameState] = useState('initial');
  const [stats, setStats] = useState({ 
    switched: { wins: 0, total: 0, history: [] }, 
    stayed: { wins: 0, total: 0, history: [] } 
  });
  const [lastChoice, setLastChoice] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayStrategy, setAutoPlayStrategy] = useState('switch');
  const [autoPlayRounds, setAutoPlayRounds] = useState(100);
  const totalGames = stats.switched.total + stats.stayed.total;
  const canShowExplanation = totalGames >= 10;

  // Initialize game
  const initializeGame = () => {
    const prizeDoor = Math.floor(Math.random() * 3);
    setDoors(Array(3).fill(null).map((_, index) => ({
      id: index,
      hasPrize: index === prizeDoor,
      content: 'door'
    })));
    setSelectedDoor(null);
    setRevealedDoor(null);
    setGameState('initial');
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Handle door selection
  const handleDoorSelect = (doorId) => {
    if (gameState === 'initial') {
      // First selection
      setSelectedDoor(doorId);
      
      // Find a door to reveal (must be a goat and not the selected door)
      const revealableDoors = doors
        .filter(door => door.id !== doorId && !door.hasPrize)
        .map(door => door.id);
      
      // There will always be at least one revealable door
      const doorToReveal = revealableDoors[Math.floor(Math.random() * revealableDoors.length)];
      
      setRevealedDoor(doorToReveal);
      // Show the goat behind the revealed door immediately
      setDoors(prev => prev.map(door => ({
        ...door,
        content: door.id === doorToReveal ? 'goat' : 'door'
      })));
      setGameState('selected');

    } else if (gameState === 'selected') {
      // Final selection
      if (doorId === revealedDoor) {
        return; // Can't select the revealed door
      }

      const switched = doorId !== selectedDoor;
      const won = doors[doorId].hasPrize;
      
      // Update statistics with history
      setStats(prev => {
        const strategy = switched ? 'switched' : 'stayed';
        const newWins = prev[strategy].wins + (won ? 1 : 0);
        const newTotal = prev[strategy].total + 1;
        
        return {
          ...prev,
          [strategy]: {
            wins: newWins,
            total: newTotal,
            history: [...prev[strategy].history, { 
              turn: newTotal,
              winRate: (newWins / newTotal) * 100
            }]
          }
        };
      });
      
      // Update final selection and game state
      setSelectedDoor(doorId);
      setLastChoice(switched ? 'switched' : 'stayed');
      
      // Reveal all doors
      setDoors(prev => prev.map(door => ({
        ...door,
        content: door.hasPrize ? 'car' : 'goat'
      })));
      
      setGameState('final');
    }
  };

  const getHostMessage = () => {
    switch (gameState) {
      case 'initial':
        return "Which door do you think the car is behind?";
      case 'selected':
        return `I've revealed a goat behind Door ${revealedDoor !== null ? revealedDoor + 1 : ''}! Would you like to switch doors?`;
      case 'final':
        return doors[selectedDoor].hasPrize 
          ? "Congratulations! You've won the car! 🎉" 
          : "Oops! You got a goat! 🐐";
      default:
        return "";
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'final' && e.key === 'r') {
        initializeGame();
        return;
      }

      if (gameState === 'final') return;

      const doorNumber = parseInt(e.key);
      if (doorNumber >= 1 && doorNumber <= 3) {
        const doorId = doorNumber - 1;
        if (gameState === 'selected' && doorId === revealedDoor) return;
        handleDoorSelect(doorId);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, revealedDoor]);

  // Keyboard shortcut display component
  const KeyboardShortcut = ({ shortcut }: { shortcut: string }) => (
    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md">
      {shortcut}
    </kbd>
  );

  const DoorComponent = ({ door, onClick, disabled }) => {
    const isSelected = door.id === selectedDoor;
    const isRevealed = door.id === revealedDoor || gameState === 'final';
    const content = isRevealed ? door.content : 'door';
    
    return (
      <div className="flex flex-col items-center gap-2">
        <div 
          className={`relative w-32 h-48 cursor-pointer transition-all
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => !disabled && onClick(door.id)}
        >
          <div className="absolute inset-0 bg-brown-500 rounded-lg border-4 border-brown-700 flex items-center justify-center">
            <div className="text-center">
              {content === 'door' && <Square className="w-16 h-16 text-brown-800" />}
              {content === 'car' && <span className="text-4xl">🚗</span>}
              {content === 'goat' && <span className="text-4xl">🐐</span>}
              <div className="mt-2 text-white font-bold">Door {door.id + 1}</div>
            </div>
          </div>
        </div>
        {!disabled && <KeyboardShortcut shortcut={(door.id + 1).toString()} />}
      </div>
    );
  };

  const ReframingVisualization = () => {
    return (
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-medium text-slate-800 dark:text-slate-100">If You Always Switch</h4>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-lg">
                <p className="font-medium mb-2 text-slate-800 dark:text-slate-100">Case 1: Initially Pick Car (1/3 chance)</p>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded text-center text-slate-800 dark:text-slate-100">Car 🚗<br/><span className="text-sm">(Your Pick)</span></div>
                  <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded text-center text-slate-800 dark:text-slate-100">Goat 🐐<br/><span className="text-sm">(Revealed)</span></div>
                  <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded text-center text-slate-800 dark:text-slate-100">Goat 🐐<br/><span className="text-sm">(Switch Here)</span></div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Result: You LOSE by switching away from car</p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-lg">
                <p className="font-medium mb-2 text-slate-800 dark:text-slate-100">Case 2: Initially Pick Goat (2/3 chance)</p>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded text-center text-slate-800 dark:text-slate-100">Goat 🐐<br/><span className="text-sm">(Your Pick)</span></div>
                  <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded text-center text-slate-800 dark:text-slate-100">Goat 🐐<br/><span className="text-sm">(Revealed)</span></div>
                  <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded text-center text-slate-800 dark:text-slate-100">Car 🚗<br/><span className="text-sm">(Switch Here)</span></div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Result: You WIN by switching to car</p>
              </div>
              
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Switching Strategy Wins: 2/3 of the time
                <br/>
                <span className="text-slate-600 dark:text-slate-400">(You win whenever you start with a goat)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-slate-800 dark:text-slate-100">If You Always Stay</h4>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-lg">
                <p className="font-medium mb-2 text-slate-800 dark:text-slate-100">Case 1: Initially Pick Car (1/3 chance)</p>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded text-center text-slate-800 dark:text-slate-100">Car 🚗<br/><span className="text-sm">(Stay Here)</span></div>
                  <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded text-center text-slate-800 dark:text-slate-100">Goat 🐐<br/><span className="text-sm">(Revealed)</span></div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-center text-slate-800 dark:text-slate-100">Goat 🐐</div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Result: You WIN by staying with car</p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-lg">
                <p className="font-medium mb-2 text-slate-800 dark:text-slate-100">Case 2: Initially Pick Goat (2/3 chance)</p>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded text-center text-slate-800 dark:text-slate-100">Goat 🐐<br/><span className="text-sm">(Stay Here)</span></div>
                  <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded text-center text-slate-800 dark:text-slate-100">Goat 🐐<br/><span className="text-sm">(Revealed)</span></div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-center text-slate-800 dark:text-slate-100">Car 🚗</div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Result: You LOSE by staying with goat</p>
              </div>
              
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Staying Strategy Wins: 1/3 of the time
                <br/>
                <span className="text-slate-600 dark:text-slate-400">(You win only when you start with the car)</span>
              </div>
            </div>
          </div>
        </div>
    );
  };

  const WinRateChart = ({ data, expectedRate, label }) => {
    const { theme } = useTheme();
    const chartData = data.map(d => ({
      ...d,
      expectedRate
    }));

    return (
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 35, left: 15 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
            />
            <XAxis 
              dataKey="turn"
              label={{ 
                value: 'Number of Attempts', 
                position: 'bottom', 
                offset: -5,
                style: { fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }
              }}
              stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'}
            />
            <YAxis 
              domain={[0, 100]}
              label={{ 
                value: 'Win Rate (%)', 
                angle: -90, 
                position: 'insideLeft', 
                offset: 5, 
                dy: 50,
                style: { fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }
              }}
              stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                color: theme === 'dark' ? '#ffffff' : '#000000'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              wrapperStyle={{ marginTop: "10px" }}
              style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}
            />
            <Line
              name="Your Win Rate"
              type="monotone"
              dataKey="winRate"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              name="Expected Rate"
              type="monotone"
              dataKey="expectedRate"
              stroke={theme === 'dark' ? '#6b7280' : '#9ca3af'}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Add autoplay functionality
  useEffect(() => {
    let autoPlayInterval;
    
    if (isAutoPlaying) {
      let roundsPlayed = 0;
      
      autoPlayInterval = setInterval(() => {
        if (roundsPlayed >= autoPlayRounds) {
          setIsAutoPlaying(false);
          return;
        }
        
        // Initialize new game if needed
        if (gameState === 'final') {
          initializeGame();
        }
        
        // Make first selection
        if (gameState === 'initial') {
          const randomDoor = Math.floor(Math.random() * 3);
          handleDoorSelect(randomDoor);
        }
        
        // Make final selection based on strategy
        if (gameState === 'selected') {
          const availableDoors = [0, 1, 2].filter(id => id !== revealedDoor);
          const finalDoor = autoPlayStrategy === 'switch' 
            ? availableDoors.find(id => id !== selectedDoor)
            : selectedDoor;
          handleDoorSelect(finalDoor);
          roundsPlayed++;
        }
      }, 100);
    }
    
    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [isAutoPlaying, gameState, autoPlayStrategy, autoPlayRounds, selectedDoor, revealedDoor]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>The Monty Hall Game</CardTitle>
        <div className="mt-4 text-slate-600 dark:text-slate-400">
          <p>
            Behind these doors: one 🚗 and two 🐐🐐. Pick a door, then decide to switch or stay after I reveal a goat!
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Game Area */}
          <div className="flex flex-col items-center">
            <div className="h-20 w-full flex items-center">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {getHostMessage()}
              </h2>
              {gameState === 'final' && (
                <div className="ml-auto flex items-center gap-2">
                  <Button onClick={initializeGame}>
                    Play Again
                  </Button>
                  <KeyboardShortcut shortcut="R" />
                </div>
              )}
            </div>
            
            <div className="h-64 flex items-center justify-center mb-6">
              <div className="flex justify-center space-x-8">
                {doors.map(door => (
                  <DoorComponent
                    key={door.id}
                    door={door}
                    onClick={handleDoorSelect}
                    disabled={gameState === 'final' || door.id === revealedDoor}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* AutoPlay Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">AutoPlay</h3>
              <div className="flex items-center gap-4">
                <select 
                  value={autoPlayStrategy}
                  onChange={(e) => setAutoPlayStrategy(e.target.value)}
                  className="px-3 py-1 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  disabled={isAutoPlaying}
                >
                  <option value="switch">Always Switch</option>
                  <option value="stay">Always Stay</option>
                </select>
                <Button 
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  variant="ghost"
                  size="icon"
                  className={isAutoPlaying ? "text-red-500 hover:text-red-600" : "text-blue-500 hover:text-blue-600"}
                >
                  {isAutoPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Watch the probabilities converge by automatically playing multiple rounds with a consistent strategy.
            </p>
          </div>

          {/* Overall Statistics */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Overall Win Rate</h3>
              <span className="text-lg text-slate-800 dark:text-slate-100">
                {Math.round(((stats.switched.wins + stats.stayed.wins) / totalGames) * 100 || 0)}%
              </span>
            </div>
            <Progress 
              value={((stats.switched.wins + stats.stayed.wins) / totalGames) * 100 || 0}
              className="h-2"
            />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {stats.switched.wins + stats.stayed.wins} wins out of {totalGames} games played
              {!canShowExplanation && (
                <span className="ml-2">
                  (Play {10 - totalGames} more times to unlock the explanation!)
                </span>
              )}
            </p>
          </div>

          {/* Strategy Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-slate-800 dark:text-slate-100">Switching Strategy</span>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                      {Math.round((stats.switched.wins / stats.switched.total) * 100 || 0)}% Win Rate
                      {!canShowExplanation && <Lock className="w-3 h-3" />}
                    </div>
                    {canShowExplanation && (
                      <div className="text-sm text-slate-500 dark:text-slate-400">(Expected: 67%)</div>
                    )}
                  </div>
                </div>
                <WinRateChart 
                  data={stats.switched.history}
                  expectedRate={canShowExplanation ? 67 : null}
                  label="Switching Strategy"
                />
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-slate-800 dark:text-slate-100">Staying Strategy</span>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                      {Math.round((stats.stayed.wins / stats.stayed.total) * 100 || 0)}% Win Rate
                      {!canShowExplanation && <Lock className="w-3 h-3" />}
                    </div>
                    {canShowExplanation && (
                      <div className="text-sm text-slate-500 dark:text-slate-400">(Expected: 33%)</div>
                    )}
                  </div>
                </div>
                <WinRateChart 
                  data={stats.stayed.history}
                  expectedRate={canShowExplanation ? 33 : null}
                  label="Staying Strategy"
                />
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 italic">
            {canShowExplanation 
              ? "Watch how your win rates converge to the expected probabilities as you play more games!"
              : `Play ${10 - totalGames} more ${10 - totalGames === 1 ? 'game' : 'games'} to reveal the expected win rates.`
            }
          </p>

          {/* Collapsible Explanation */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <button
              onClick={() => canShowExplanation && setShowExplanation(!showExplanation)}
              className={`w-full flex items-center justify-between
                ${!canShowExplanation && 'opacity-50 cursor-not-allowed'}`}
              disabled={!canShowExplanation}
            >
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Understanding the Probability</h2>
                {!canShowExplanation ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                      Play {10 - totalGames} more {10 - totalGames === 1 ? 'game' : 'games'} to unlock
                    </span>
                  </>
                ) : null}
              </div>
              {canShowExplanation && (
                showExplanation ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {showExplanation && canShowExplanation && (
              <div className="mt-4">
                <ReframingVisualization />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MontyHallGame;
