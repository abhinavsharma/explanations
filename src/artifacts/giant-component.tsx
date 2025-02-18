import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import _ from 'lodash';
import { Play, Square } from "lucide-react";

const VillageNetwork = () => {
  const villagerNames = [
    'Aisha', 'Liam', 'Ming', 'Noah', 'Priya', 
    'Juan', 'Sofia', 'Kai', 'Isabella', 'Wei',
    'Fatima', 'James', 'Yuki', 'Ahmed', 'Amara',
    'Diego', 'Zara', 'Hiroshi', 'Elena', 'Miguel',
    'Rania', 'Alexandru', 'Ji-eun', 'Sebastian', 'Leila',
    'David', 'Aria', 'Giuseppe', 'Indira', 'Chen',
    'Grace', 'Mateo', 'Valentina', 'Sanjay', 'Lily',
    'Andrei', 'Chiara', 'Johan', 'Esra', 'Raja',
    'Maria', 'Jamal', 'Chitra', 'Boris', 'Amira'
  ];

  const [numVillagers, setNumVillagers] = useState(12);
  const [probability, setProbability] = useState(1/12);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [tempEdge, setTempEdge] = useState(null);
  const [message, setMessage] = useState('');
  const [running, setRunning] = useState(false);
  const [components, setComponents] = useState([]);
  const [largestComponentSize, setLargestComponentSize] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  
  const stopSimulationRef = useRef(false);
  const simulationPromiseRef = useRef(null);
  
  const componentColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
    '#2ECC71', '#F1C40F', '#E67E22', '#E74C3C',
    '#1ABC9C', '#34495E', '#95A5A6'
  ];

  const calculateNodePosition = (index, total) => {
    const radius = 150;
    const angle = (2 * Math.PI * index) / total;
    return {
      x: 200 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle)
    };
  };

  const getAllNodePositions = useCallback(() => {
    return Array.from({ length: numVillagers }, (_, i) => ({
      id: i,
      name: villagerNames[i],
      position: calculateNodePosition(i, numVillagers)
    }));
  }, [numVillagers]);

  const findConnectedComponents = useCallback(() => {
    if (nodes.length === 0) return [];

    // Create adjacency list
    const adjacencyList = new Map();
    nodes.forEach(node => {
      adjacencyList.set(node.id, new Set());
    });
    
    edges.forEach(edge => {
      adjacencyList.get(edge.source).add(edge.target);
      adjacencyList.get(edge.target).add(edge.source);
    });

    const visited = new Set();
    const components = [];

    const dfs = (nodeId, currentComponent) => {
      visited.add(nodeId);
      currentComponent.push(nodeId);

      const neighbors = adjacencyList.get(nodeId) || new Set();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, currentComponent);
        }
      }
    };

    // Find all components
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        const currentComponent = [];
        dfs(node.id, currentComponent);
        if (currentComponent.length > 0) {
          components.push(currentComponent);
        }
      }
    }

    return components;
  }, [nodes, edges]);

  const updateComponents = useCallback(() => {
    if (nodes.length === 0) {
      setComponents([]);
      setLargestComponentSize(0);
      return;
    }

    const newComponents = findConnectedComponents();
    if (newComponents.length > 0 || nodes.length > 0) {
      setComponents(newComponents);
      const maxSize = Math.max(...newComponents.map(comp => comp.length), 0);
      setLargestComponentSize(maxSize);
    }
  }, [findConnectedComponents, nodes.length]);

  useEffect(() => {
    updateComponents();
  }, [edges, updateComponents]);

  const sleep = (ms) => new Promise<void>(resolve => {
    const timeout = setTimeout(() => {
      if (!stopSimulationRef.current) {
        resolve();
      }
    }, ms);
    
    simulationPromiseRef.current = {
      timeout,
      resolve
    };
  });

  const stopSimulation = () => {
    stopSimulationRef.current = true;
    if (simulationPromiseRef.current) {
      clearTimeout(simulationPromiseRef.current.timeout);
      simulationPromiseRef.current.resolve();
    }
    setRunning(false);
    setMessage('Simulation stopped');
    setTempEdge(null);
  };

  const runSimulation = async () => {
    setRunning(true);
    setNodes([]);
    setEdges([]);
    setComponents([]);
    setCurrentStep(0);
    
    // Calculate total steps (nodes + potential edges)
    const totalPotentialSteps = numVillagers + (numVillagers * (numVillagers - 1)) / 2;
    setTotalSteps(totalPotentialSteps);
    
    stopSimulationRef.current = false;

    try {
      for (let i = 0; i < numVillagers && !stopSimulationRef.current; i++) {
        setCurrentStep(prev => prev + 1);
        const newNode = {
          id: i,
          name: villagerNames[i],
          position: calculateNodePosition(i, numVillagers)
        };
        
        setMessage(`${villagerNames[i]} joined the village`);
        setNodes(prev => [...prev, newNode]);
        await sleep(1000);

        for (let j = 0; j < i && !stopSimulationRef.current; j++) {
          setCurrentStep(prev => prev + 1);
          setMessage(`Testing friendship between ${villagerNames[i]} and ${villagerNames[j]}`);
          setTempEdge({ source: i, target: j });
          await sleep(1000);

          if (Math.random() < probability) {
            setMessage(`${villagerNames[i]} and ${villagerNames[j]} became friends!`);
            setEdges(prev => [...prev, { source: i, target: j }]);
          } else {
            setMessage(`${villagerNames[i]} and ${villagerNames[j]} didn't become friends`);
          }
          setTempEdge(null);
          await sleep(500);
        }

        updateComponents();
      }

      if (!stopSimulationRef.current) {
        setMessage('Simulation complete! Start a new simulation to try different parameters.');
      }
    } finally {
      setRunning(false);
      stopSimulationRef.current = false;
      simulationPromiseRef.current = null;
    }
  };

  const handleVillagersChange = (value) => {
    const newNumVillagers = value[0];
    setNumVillagers(newNumVillagers);
    setProbability(1/newNumVillagers);
  };

  const allNodes = getAllNodePositions();

  return (
    <div className="w-full max-w-6xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Why everyone knows everyone in a village</CardTitle>
          <p className="text-sm text-muted-foreground">
            Watch how random friendships create a village network. As more connections form, 
            small isolated groups start joining together through new friendships. At a certain 
            point, these mergers cascade - one more friendship can suddenly connect many 
            previously separate groups, causing a "giant component" to emerge that contains 
            a significant portion of the village. This abrupt transition from fragmented groups 
            to one large community was a key discovery of Erdős and Rényi. We use a friendship 
            probability of 1/n (where n is the village size) because in real social networks, 
            people tend to maintain a relatively constant number of close relationships regardless 
            of community size.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-end space-x-6">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Total size of the village: {numVillagers}
                </label>
                <Slider
                  value={[numVillagers]}
                  onValueChange={handleVillagersChange}
                  min={5}
                  max={30}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Probability two people become friends: 1/{numVillagers} ≈ {(1/numVillagers).toFixed(3)}
                </label>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button
                onClick={running ? stopSimulation : runSimulation}
                variant={running ? "destructive" : "default"}
                size="icon"
                className="w-10 h-10"
              >
                {running ? <Square size={20} /> : <Play size={20} />}
              </Button>
            </div>
          </div>

          {running && (
            <div className="space-y-2 mt-4">
              <hr className="my-4" />
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Progress: {Math.round((currentStep / totalSteps) * 100)}%
              </p>
            </div>
          )}

          <h2 className="text-lg font-medium mt-12">Network Simulation</h2>
          <div className="flex space-x-6">
            <div className="relative w-96 h-96 border rounded-lg overflow-hidden">
              <svg width="400" height="400">
                {allNodes.map((source, i) => 
                  allNodes.slice(i + 1).map((target, j) => (
                    <line
                      key={`preview-edge-${i}-${j}`}
                      x1={source.position.x}
                      y1={source.position.y}
                      x2={target.position.x}
                      y2={target.position.y}
                      className="stroke-muted"
                      strokeWidth="1"
                      opacity={nodes.length <= i ? 1 : 0}
                    />
                  ))
                )}

                {edges.map((edge, i) => (
                  <line
                    key={`edge-${i}`}
                    x1={nodes[edge.source].position.x}
                    y1={nodes[edge.source].position.y}
                    x2={nodes[edge.target].position.x}
                    y2={nodes[edge.target].position.y}
                    className="stroke-foreground"
                    strokeWidth="2"
                  />
                ))}
                
                {tempEdge && (
                  <line
                    x1={nodes[tempEdge.source].position.x}
                    y1={nodes[tempEdge.source].position.y}
                    x2={nodes[tempEdge.target].position.x}
                    y2={nodes[tempEdge.target].position.y}
                    className="stroke-muted"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                )}

                {allNodes.map((node, i) => {
                  const isActive = i < nodes.length;
                  const componentIndex = isActive ? components.findIndex(comp => comp.includes(node.id)) : -1;
                  const color = componentIndex >= 0 ? componentColors[componentIndex % componentColors.length] : 'hsl(var(--muted))';
                  
                  return (
                    <g key={`node-${i}`}>
                      <circle
                        cx={node.position.x}
                        cy={node.position.y}
                        r="10"
                        fill={isActive ? color : 'hsl(var(--muted))'}
                        className="stroke-border"
                        strokeWidth={isActive ? 2 : 1}
                      />
                      <text
                        x={node.position.x}
                        y={node.position.y + 25}
                        textAnchor="middle"
                        className={`text-xs ${isActive ? 'fill-foreground' : 'fill-muted-foreground'}`}
                      >
                        {node.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex-1 space-y-4">
              <div className="p-4 space-y-2 bg-muted rounded-lg">
                <h3 className="font-medium">Network Statistics</h3>
                <div className="space-y-2">
                  <p>Villagers: {nodes.length} / {numVillagers}</p>
                  <p>Connected Components: {components.length}</p>
                  <p>Largest Component Size: {largestComponentSize}</p>
                </div>
              </div>

              <div className="p-4 space-y-2 bg-muted rounded-lg">
                <h3 className="font-medium">Activity Log</h3>
                <p>{message}</p>
              </div>

              <div className="p-4 space-y-2 bg-muted rounded-lg">
                <h3 className="font-medium">Connected Components</h3>
                <div className="space-y-2">
                  {components.map((component, i) => (
                    <div key={`component-${i}`}>
                      <span 
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: componentColors[i % componentColors.length] }}
                      />
                      Component {i + 1}: {component.map(nodeId => nodes.find(n => n.id === nodeId)?.name).join(', ')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <details className="space-y-2">
              <summary className="text-lg font-medium cursor-pointer hover:text-primary">
                Mathematical Intuition Behind Giant Components
              </summary>
              <div className="p-4 space-y-4 bg-muted rounded-lg mt-2">
                <p>
                  When the probability of connection is p = c/n (where c &gt; 1), a giant component emerges. 
                  Here's why:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Consider following a path from any node. Each node has on average c connections.</li>
                  <li>At each step, we discover approximately c-1 new nodes (excluding the one we came from).</li>
                  <li>After k steps, we expect to reach (c-1)ᵏ new nodes.</li>
                  <li>When c &gt; 1, this grows exponentially until we hit a significant fraction of the network.</li>
                </ol>
                <p className="mt-2">
                  For the remaining small components:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>The probability of a component of size k is roughly p^(k-1)(1-p)^(k(n-k))</li>
                  <li>When p = c/n, components larger than O(log n) become exponentially unlikely</li>
                  <li>This creates the characteristic structure: one giant component and several small ones</li>
                </ol>
              </div>
            </details>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VillageNetwork;