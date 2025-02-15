import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from 'lucide-react';

const GaltonTable = () => {
  const LEVELS = 12;  // Number of decision levels
  const MAX_STACK = 20;  // Maximum height of ball stacks
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
    <Card className="w-full max-w-5xl mx-auto">
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
          <h3 className="font-semibold text-slate-900">Understanding the Mathematics</h3>
          
          <div className="space-y-4">
            <h4 className="font-medium text-slate-800">1. Single Ball Path</h4>
            <p>
              Each ball makes 12 decisions (left or right). Since each choice is equally likely, 
              this is like flipping a coin 12 times and counting the number of heads.
            </p>

            <h4 className="font-medium text-slate-800">2. Possible Paths</h4>
            <p>
              To reach any final position, a ball needs a specific combination of left and right moves. 
              For example, to reach the center, a ball needs an equal number of lefts and rights (6 each).
            </p>

            <h4 className="font-medium text-slate-800">3. Why the Middle is Most Common</h4>
            <p>
              There's only one way to get all lefts (LLLLLLLLLLLL) or all rights (RRRRRRRRRRRR), 
              but there are many ways to get 6 of each (like LLLLLLRRRRRR, LRLRLRLRLRLR, etc.). 
              In fact, there are 924 different ways to arrange 6 lefts and 6 rights!
            </p>

            <h4 className="font-medium text-slate-800">4. The Binomial Formula</h4>
            <p>
              For any position k steps to the right of center after n levels:
            </p>
            <div className="p-4 bg-slate-50 rounded-lg space-y-2">
              <p className="font-mono text-sm">
                P(k) = C(n,k) × (1/2)ⁿ
              </p>
              <p>
                Where C(n,k) counts the number of ways to choose k right moves out of n total moves.
                The (1/2)ⁿ term represents the probability of any specific sequence occurring.
              </p>
            </div>

            <h4 className="font-medium text-slate-800">5. Connection to Normal Distribution</h4>
            <p>
              As we drop more balls, this discrete binomial distribution starts looking like a smooth normal distribution. 
              This is because of the Central Limit Theorem - when you add up many random events (like our left/right choices), 
              the result tends toward a normal distribution.
            </p>
            
            <details className="bg-slate-50 rounded-lg p-4">
              <summary className="font-medium text-slate-800 cursor-pointer">
                Outline of Central Limit Theorem Proof
              </summary>
              <div className="mt-4 space-y-3 text-sm">
                <p>
                  The proof follows these key steps, using characteristic functions (Fourier transforms of probability distributions):
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    First, we express our random variables (left/right choices) in standardized form:
                    <div className="font-mono bg-slate-100 p-2 mt-1 rounded">
                      Xᵢ = (Choice - μ)/σ
                    </div>
                  </li>
                  <li>
                    The characteristic function of the sum is the product of individual characteristic functions:
                    <div className="font-mono bg-slate-100 p-2 mt-1 rounded">
                      φₙ(t) = [φ(t/√n)]ⁿ
                    </div>
                  </li>
                  <li>
                    Taylor expand log[φ(t/√n)] around t = 0:
                    <div className="font-mono bg-slate-100 p-2 mt-1 rounded">
                      log[φ(t/√n)] = -t²/2n + o(1/n)
                    </div>
                  </li>
                  <li>
                    Therefore:
                    <div className="font-mono bg-slate-100 p-2 mt-1 rounded">
                      φₙ(t) → exp(-t²/2) as n → ∞
                    </div>
                  </li>
                  <li>
                    This is the characteristic function of the standard normal distribution, proving convergence in distribution.
                  </li>
                </ol>
                <p className="italic mt-2">
                  Note: This is a high-level overview. The complete proof requires careful handling of 
                  convergence conditions and error terms.
                </p>
              </div>
            </details>
            
            <h4 className="font-medium text-slate-800">6. The Final Shape</h4>
            <p>
              The resulting normal distribution is centered at n/2 (half of the total levels) with a spread determined by 
              √(n/4). This means:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Most balls end up near the middle</li>
              <li>The spread increases with more levels (but more slowly due to the square root)</li>
              <li>The shape becomes more symmetric and smooth with more balls</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GaltonTable;