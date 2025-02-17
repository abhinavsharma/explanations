import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import _ from 'lodash';
import { Play, Square } from "lucide-react";

const VillageNetwork = () => {
  const villagerNames = [
    'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 
    'Ethan', 'Sophia', 'Mason', 'Isabella', 'William',
    'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia'
  ];

  const [numVillagers, setNumVillagers] = useState(5);
  const [probability, setProbability] = useState(0.5);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [tempEdge, setTempEdge] = useState(null);
  const [message, setMessage] = useState('');
  const [running, setRunning] = useState(false);
  const [components, setComponents] = useState([]);
  const [largestComponentSize, setLargestComponentSize] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
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

  const sleep = (ms) => new Promise(resolve => {
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
    // Reset state only when starting a new simulation
    setRunning(true);
    setNodes([]);
    setEdges([]);
    setComponents([]);
    setCurrentStep(0);
    stopSimulationRef.current = false;

    try {
      for (let i = 0; i < numVillagers && !stopSimulationRef.current; i++) {
        const newNode = {
          id: i,
          name: villagerNames[i],
          position: calculateNodePosition(i, numVillagers)
        };
        
        setMessage(`${villagerNames[i]} joined the village`);
        setNodes(prev => [...prev, newNode]);
        await sleep(1000);

        for (let j = 0; j < i && !stopSimulationRef.current; j++) {
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

  const allNodes = getAllNodePositions();

  return (
    <div className="w-full max-w-6xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Giant Component Emergence</CardTitle>
          <p className="text-sm text-muted-foreground">
            Watch how small, isolated groups merge into one large connected component as more villagers join. 
            This demonstrates a key phenomenon in network theory where, at a critical threshold of connections, 
            a "giant component" suddenly emerges containing a significant fraction of all nodes.
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
                  onValueChange={(value) => setNumVillagers(value[0])}
                  min={2}
                  max={15}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Probability two people become friends: {probability.toFixed(2)}
                </label>
                <Slider
                  value={[probability]}
                  onValueChange={(value) => setProbability(value[0])}
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Network Simulation</CardTitle>
        </CardHeader>
        <CardContent>
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Network Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>Villagers: {nodes.length} / {numVillagers}</p>
                    <p>Connected Components: {components.length}</p>
                    <p>Largest Component Size: {largestComponentSize}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{message}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Connected Components</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VillageNetwork;