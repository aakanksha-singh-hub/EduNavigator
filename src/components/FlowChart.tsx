import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  Handle,
  Position,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { BGPattern } from './ui/bg-pattern';
import { CareerNode, CareerEdge } from '../lib/types';

interface FlowChartProps {
  nodes: CareerNode[];
  edges: CareerEdge[];
  className?: string;
  height?: string | number;
}

// Function to calculate better node positions using a hierarchical layout
const calculateNodePositions = (nodes: CareerNode[]): CareerNode[] => {
  const horizontalSpacing = 320;
  const verticalSpacing = 220;
  
  // Group nodes by type and create a hierarchical layout
  const nodesByType = {
    course: nodes.filter(n => n.type === 'course'),
    internship: nodes.filter(n => n.type === 'internship'),
    job: nodes.filter(n => n.type === 'job'),
    company: nodes.filter(n => n.type === 'company'),
    skill: nodes.filter(n => n.type === 'skill'),
  };
  
  const updatedNodes = [...nodes];
  
  // Calculate the center position for the main flow
  const maxNodesInRow = Math.max(
    nodesByType.course.length,
    nodesByType.internship.length,
    nodesByType.job.length,
    nodesByType.company.length
  );
  
  const totalWidth = maxNodesInRow * horizontalSpacing;
  const startX = Math.max(100, (800 - totalWidth) / 2); // Center the flow
  
  // Layout main career path (vertical flow)
  let currentY = 80;
  
  // Courses (top level)
  nodesByType.course.forEach((node, index) => {
    const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
    if (nodeIndex !== -1) {
      const x = startX + (index * horizontalSpacing);
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        position: { x, y: currentY }
      };
    }
  });
  
  currentY += verticalSpacing;
  
  // Internships (second level)
  nodesByType.internship.forEach((node, index) => {
    const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
    if (nodeIndex !== -1) {
      const x = startX + (index * horizontalSpacing);
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        position: { x, y: currentY }
      };
    }
  });
  
  currentY += verticalSpacing;
  
  // Jobs (third level)
  nodesByType.job.forEach((node, index) => {
    const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
    if (nodeIndex !== -1) {
      const x = startX + (index * horizontalSpacing);
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        position: { x, y: currentY }
      };
    }
  });
  
  currentY += verticalSpacing;
  
  // Companies (fourth level)
  nodesByType.company.forEach((node, index) => {
    const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
    if (nodeIndex !== -1) {
      const x = startX + (index * horizontalSpacing);
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        position: { x, y: currentY }
      };
    }
  });
  
  // Skills (right side, vertical layout)
  const skillsX = startX + totalWidth + 100;
  let skillsY = 80;
  
  nodesByType.skill.forEach((node, index) => {
    const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
    if (nodeIndex !== -1) {
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        position: { x: skillsX, y: skillsY + (index * verticalSpacing) }
      };
    }
  });
  
  return updatedNodes;
};

const nodeTypes: NodeTypes = {
  course: ({ data }) => (
    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-4 min-w-[220px] shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 bg-blue-500 border-2 border-white" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-blue-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-blue-500 border-2 border-white" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-blue-500 border-2 border-white" />
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
        <div className="font-bold text-white text-sm">{data?.title || 'Course'}</div>
      </div>
      <div className="text-xs text-gray-200 leading-relaxed">{data?.description || 'Course description'}</div>
      <div className="flex flex-wrap gap-2 mt-3">
        {data?.duration && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/30 text-white text-xs rounded-full">
            ⏱️ {data.duration}
          </span>
        )}
        {data?.difficulty && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/30 text-white text-xs rounded-full">
            📚 {data.difficulty}
          </span>
        )}
      </div>
    </div>
  ),
  internship: ({ data }) => (
    <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl p-4 min-w-[220px] shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 bg-purple-500 border-2 border-white" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-purple-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-purple-500 border-2 border-white" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-purple-500 border-2 border-white" />
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
        <div className="font-bold text-white text-sm">{data?.title || 'Internship'}</div>
      </div>
      <div className="text-xs text-gray-200 leading-relaxed">{data?.description || 'Internship description'}</div>
      <div className="flex flex-wrap gap-2 mt-3">
        {data?.duration && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/30 text-white text-xs rounded-full">
            ⏱️ {data.duration}
          </span>
        )}
      </div>
    </div>
  ),
  job: ({ data }) => (
    <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl p-4 min-w-[220px] shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 bg-green-500 border-2 border-white" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-green-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-green-500 border-2 border-white" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-green-500 border-2 border-white" />
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <div className="font-bold text-white text-sm">{data?.title || 'Job'}</div>
      </div>
      <div className="text-xs text-gray-200 leading-relaxed">{data?.description || 'Job description'}</div>
      <div className="flex flex-wrap gap-2 mt-3">
        {data?.salary && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/30 text-white text-xs rounded-full">
            💰 {data.salary}
          </span>
        )}
      </div>
    </div>
  ),
  company: ({ data }) => (
    <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-xl p-4 min-w-[220px] shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 bg-yellow-500 border-2 border-white" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-yellow-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-yellow-500 border-2 border-white" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-yellow-500 border-2 border-white" />
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
        <div className="font-bold text-white text-sm">{data?.title || 'Company'}</div>
      </div>
      <div className="text-xs text-gray-200 leading-relaxed">{data?.description || 'Company description'}</div>
    </div>
  ),
  skill: ({ data }) => (
    <div className="bg-gradient-to-br from-slate-500/10 to-slate-600/5 border border-slate-500/30 rounded-xl p-4 min-w-[180px] shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 bg-slate-500 border-2 border-white" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-slate-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-slate-500 border-2 border-white" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-slate-500 border-2 border-white" />
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
        <div className="font-bold text-white text-sm">{data?.title || 'Skill'}</div>
      </div>
      <div className="text-xs text-gray-200 leading-relaxed">{data?.description || 'Skill description'}</div>
    </div>
  ),
};

export const FlowChart: React.FC<FlowChartProps> = ({ nodes, edges, className, height = '700px' }) => {
  // Debug logging
  console.log('FlowChart received nodes:', nodes);
  console.log('FlowChart received edges:', edges);
  
  // Calculate better positions to prevent overlapping
  const positionedNodes = useMemo(() => {
    return calculateNodePositions(nodes);
  }, [nodes]);
  
  // Convert CareerNode to ReactFlow Node format
  const reactFlowNodes = useMemo(() => {
    return positionedNodes.map((node: CareerNode) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node,
    }));
  }, [positionedNodes]);
  
  const [flowNodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);
  
  // Update nodes when props change
  useEffect(() => {
    setNodes(reactFlowNodes);
  }, [reactFlowNodes, setNodes]);

  // Auto-fit view when nodes change
  useEffect(() => {
    const timer = setTimeout(() => {
      // This will trigger fitView after nodes are updated
      const reactFlowInstance = document.querySelector('.react-flow');
      if (reactFlowInstance) {
        // Force a re-render to trigger fitView
        setNodes(prevNodes => [...prevNodes]);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [nodes, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className={`${className} relative overflow-hidden rounded-2xl border border-border/50`} style={{ width: '100%', height }}>
      <BGPattern variant="dots" mask="fade-center" size={20} fill="rgba(255,255,255,0.02)" />
      <ReactFlow
        nodes={flowNodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.3,
          includeHiddenNodes: false,
          minZoom: 0.5,
          maxZoom: 1.2,
        }}
        className="bg-gradient-to-br from-background to-muted/20"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { 
            strokeWidth: 2.5, 
            stroke: '#8b5cf6',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#8b5cf6',
            width: 20,
            height: 20,
          },
        }}
        connectionLineStyle={{ 
          strokeWidth: 2.5, 
          stroke: '#8b5cf6',
          strokeDasharray: '5,5',
        }}
        minZoom={0.4}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        selectNodesOnDrag={false}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        preventScrolling={false}
        attributionPosition="bottom-left"
      >
        <Controls 
          className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg"
          position="top-left"
        />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.type) {
              case 'course': return '#3b82f6';
              case 'internship': return '#8b5cf6';
              case 'job': return '#10b981';
              case 'company': return '#f59e0b';
              case 'skill': return '#6b7280';
              default: return '#3b82f6';
            }
          }}
          nodeStrokeWidth={3}
          nodeBorderRadius={8}
          className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg"
          position="bottom-right"
          zoomable
          pannable
        />
        <Background 
          color="#374151" 
          gap={25} 
          size={1}
          className="opacity-20"
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </div>
  );
};
