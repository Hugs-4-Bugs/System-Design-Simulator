import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  Connection, 
  Edge, 
  Node,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { ComponentType, SimulationState, NodeMetrics } from '../types';

const nodeTypes = {
  systemNode: CustomNode,
};

interface CanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  simulationState: SimulationState;
  metrics: Record<string, NodeMetrics>;
}

export default function Canvas({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  setNodes, 
  setEdges, 
  simulationState, 
  metrics 
}: CanvasProps) {
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
      ...params, 
      animated: simulationState.isRunning,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
      style: { stroke: '#10b981' }
    }, eds)),
    [setEdges, simulationState.isRunning]
  );

  // Sync metrics to nodes
  useEffect(() => {
    setNodes((nds) => 
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          metrics: metrics[node.id],
        },
      }))
    );
  }, [metrics, setNodes]);

  // Sync animation state to edges
  useEffect(() => {
    setEdges((eds) => 
      eds.map((edge) => ({
        ...edge,
        animated: simulationState.isRunning,
        style: { 
          ...edge.style, 
          stroke: simulationState.isRunning ? '#10b981' : '#3f3f46',
          strokeWidth: simulationState.isRunning ? 2 : 1,
        }
      }))
    );
  }, [simulationState.isRunning, setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as ComponentType;
      if (!type) return;

      const position = { x: event.clientX - 200, y: event.clientY - 100 };
      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: 'systemNode',
        position,
        data: { label: `New ${type.replace('-', ' ')}`, type, instances: 1 },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  return (
    <div className="w-full h-full bg-zinc-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
        className="bg-dot-white/[0.05]"
      >
        <Background color="#27272a" gap={20} />
        <Controls className="bg-zinc-900 border-zinc-800 fill-white" />
        <Panel position="top-left" className="bg-zinc-900/80 backdrop-blur-md p-2 rounded-lg border border-zinc-800 text-zinc-400 text-xs">
          Drag components from the sidebar to design your architecture
        </Panel>
      </ReactFlow>
    </div>
  );
}
