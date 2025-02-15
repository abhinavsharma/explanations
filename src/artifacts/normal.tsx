import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from 'lucide-react';

const GaltonTable = () => {
  const LEVELS = 8;  // Number of decision levels
  const MAX_STACK = 10;  // Maximum height of ball stacks
  const [balls, setBalls] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [ballCount, setBallCount] = useState(0);
  const [bins, setBins] = useState(Array(LEVELS * 2 + 1).fill([]));
  
const COLORS = [
    'bg-blue-500',
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-teal-500'
  ];

  // Create a new ball at the top
  const addBall = () => {
    if (ballCount >= 100) {
      setIsRunning(false);
      return;
    }
    
    const newBall = {
      id: Date.now(),
      row: 0,
      col: LEVELS,
      path: [],
      color: COLORS[ballCount % COLORS.length]
    };
    
    setBalls(prev => [...prev, newBall]);
    setBallCount(prev => prev + 1);
  };
  
  // Update ball positions
  useEffect(() => {
    if (!isRunning) return;
    
    const moveInterval = setInterval(() => {
      setBalls(prevBalls => {
        // Get current row occupancy
        const occupiedRows = new Set(prevBalls.map(ball => ball.row));
        
        // Move existing balls
        const movedBalls = prevBalls.map(ball => {
          // If ball reached bottom, remove it and add to bins
          if (ball.row >= LEVELS) {
            setBins(prevBins => {
              const newBins = [...prevBins];
              newBins[ball.col] = [...(newBins[ball.col] || []), ball.id];
              return newBins;
            });
            return null;
          }
          
          // Check if next row is occupied
          if (occupiedRows.has(ball.row + 1)) {
            return ball;
          }
          
          // Move ball down and randomly left/right
          const direction = Math.random() < 0.5 ? -1 : 1;
          return {
            ...ball,
            row: ball.row + 1,
            col: ball.col + direction,
            path: [...ball.path, direction]
          };
        }).filter(ball => ball !== null);
        
        // Add new ball if top row is empty and we haven't reached limit
        if (!occupiedRows.has(0) && ballCount < 100) {
          addBall();
        }
        
        return movedBalls;
      });
    }, 200);  // Faster interval
    
    return () => clearInterval(moveInterval);
  }, [isRunning, ballCount]);
  
  const reset = () => {
    setBalls([]);
    setBins(Array(LEVELS * 2 + 1).fill([]));
    setBallCount(0);
    setIsRunning(false);
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>The Normal Distribution Emerges</CardTitle>
        <div className="mt-4 space-y-4 text-slate-600">
          <p>
            Watch how a normal distribution naturally emerges from simple random choices. Each ball has an equal (50/50) chance 
            of going left or right at each level. This is similar to flipping a coin multiple times - the more flips, the more 
            likely you are to get close to an equal number of heads and tails.
          </p>
          <p>
            The middle path represents getting an equal number of left/right choices, which is most likely. 
            Extreme paths (all left or all right) are much less likely, creating the characteristic bell curve shape.
          </p>
        </div>
        <div className="flex gap-4 mt-4">
          <Button 
            onClick={() => setIsRunning(!isRunning)}
            variant="outline"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button 
            onClick={reset}
            variant="outline"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <div className="text-sm mt-2">
            Balls: {ballCount}/100
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <tbody>
              {/* Decision levels with pegs */}
              {Array.from({ length: LEVELS }).map((_, row) => (
                <tr key={row} className="h-10">
                  {Array.from({ length: LEVELS * 2 + 1 }).map((_, col) => {
                    const isOffset = row % 2 === 1;
                    const cellClass = isOffset ? 'relative left-5' : '';
                    
                    return (
                      <td key={col} className={`w-10 h-10 ${cellClass}`}>
                        <div className="w-2 h-2 rounded-full bg-slate-300 mx-auto" />
                        {balls.some(ball => ball.row === row && ball.col === col) && 
                          <div className={`w-3 h-3 rounded-full ${balls.find(ball => ball.row === row && ball.col === col).color} mx-auto animate-bounce`} />
                        }
                      </td>
                    );
                  })}
                </tr>
              ))}
              
              {/* Separator line */}
              <tr>
                <td colSpan={LEVELS * 2 + 1} className="h-1 bg-slate-300 p-0" />
              </tr>
              
              {/* Collection bins */}
              {Array.from({ length: MAX_STACK }).map((_, stackRow) => (
                <tr key={`stack-${stackRow}`} className="h-10">
                  {Array.from({ length: LEVELS * 2 + 1 }).map((_, col) => (
                    <td key={col} className="w-10 h-10 border-x border-slate-200">
                      {bins[col]?.length > (MAX_STACK - 1 - stackRow) && 
                        <div className={`w-3 h-3 rounded-full ${COLORS[bins[col].length % COLORS.length]} mx-auto`} />
                      }
                    </td>
                  ))}
                </tr>
              ))}
              
              {/* Bin counts */}
              <tr className="h-10 text-sm font-medium">
                {bins.map((bin, col) => (
                  <td key={col} className="w-10">
                    {bin.length}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 space-y-4 text-slate-600 border-t pt-4">
          <h3 className="font-semibold text-slate-900">Mathematical Explanation</h3>
          <p>
            This process follows the binomial distribution with n trials (levels) and p = 0.5 probability. 
            For a ball reaching position k after n levels:
          </p>
          <div className="p-4 bg-slate-50 rounded-lg font-mono text-sm">
            P(k) = C(n,k) × (0.5)ⁿ
          </div>
          <p>
            Where C(n,k) is the number of ways to choose k right moves out of n levels. 
            As n increases, this binomial distribution approaches a normal distribution according to the Central Limit Theorem:
          </p>
          <div className="p-4 bg-slate-50 rounded-lg font-mono text-sm">
            μ = np = n/2 (center position)<br />
            σ = √(np(1-p)) = √(n/4) (spread)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GaltonTable;