import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AgentNode } from './AgentNode';
import { AGENT_METADATA } from '../../constants';
import { useTheme } from '../../context/ThemeContext';

const nodeTypes = { agentNode: AgentNode };

export function AgentWorkflowGraph({
  agentStates = {},
  activeAgent = null,
  lastEdge = null,
  onNodeSelect,
}) {
  const { theme } = useTheme();

  const nodes = useMemo(
    () => [
      {
        id: 'UserInput',
        type: 'agentNode',
        position: { x: 20, y: 150 },
        data: {
          agentKey: 'UserInput',
          label: 'User Input',
          subtitle: 'Topic & Constraints',
          isTerminal: true,
          isActive: activeAgent === 'UserInput',
        },
      },
      {
        id: 'Researcher',
        type: 'agentNode',
        position: { x: 240, y: 120 },
        data: {
          agentKey: 'Researcher',
          label: 'Researcher Agent',
          role: AGENT_METADATA.Researcher.role,
          isActive: activeAgent === 'Researcher',
          ...(agentStates.Researcher || {}),
        },
      },
      {
        id: 'Writer',
        type: 'agentNode',
        position: { x: 530, y: 120 },
        data: {
          agentKey: 'Writer',
          label: 'Writer Agent',
          role: AGENT_METADATA.Writer.role,
          isActive: activeAgent === 'Writer',
          ...(agentStates.Writer || {}),
        },
      },
      {
        id: 'Editor',
        type: 'agentNode',
        position: { x: 820, y: 120 },
        data: {
          agentKey: 'Editor',
          label: 'Editor Agent',
          role: AGENT_METADATA.Editor.role,
          isActive: activeAgent === 'Editor',
          ...(agentStates.Editor || {}),
        },
      },
      {
        id: 'Fact-Checker',
        type: 'agentNode',
        position: { x: 1110, y: 120 },
        data: {
          agentKey: 'Fact-Checker',
          label: 'Fact-Checker Agent',
          role: AGENT_METADATA['Fact-Checker'].role,
          isActive: activeAgent === 'Fact-Checker',
          ...(agentStates['Fact-Checker'] || {}),
        },
      },
      {
        id: 'FinalOutput',
        type: 'agentNode',
        position: { x: 1410, y: 95 },
        data: {
          agentKey: 'FinalOutput',
          label: 'Final Output',
          subtitle: 'Verified & Approved',
          isTerminal: true,
          isActive: activeAgent === 'FinalOutput',
        },
      },
      {
        id: 'HumanReview',
        type: 'agentNode',
        position: { x: 1410, y: 235 },
        data: {
          agentKey: 'HumanReview',
          label: 'Human Review Required',
          subtitle: 'Max Revisions Reached',
          isTerminal: true,
          isActive: activeAgent === 'HumanReview',
        },
      },
    ],
    [agentStates, activeAgent]
  );

  const edges = useMemo(() => {
    const makeEdge = (
      id,
      source,
      target,
      label,
      { isFeedback = false, color = '#7c3aed', sourceHandle, targetHandle } = {}
    ) => {
      const isHighlighted = lastEdge === `${source}->${target}`;
      const stroke = isHighlighted ? '#8b5cf6' : isFeedback ? color : '#52525b';
      return {
        id,
        source,
        target,
        sourceHandle,
        targetHandle,
        label,
        animated: isHighlighted,
        type: 'smoothstep',
        style: {
          stroke,
          strokeWidth: isHighlighted ? 2.5 : 1.5,
          strokeDasharray: isFeedback ? '5 4' : undefined,
        },
        labelStyle: {
          fill: theme === 'dark' ? '#a1a1aa' : '#52525b',
          fontSize: 10,
          fontWeight: 500,
        },
        labelBgStyle: {
          fill: theme === 'dark' ? '#0f1219' : '#ffffff',
          fillOpacity: 0.9,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: stroke,
        },
      };
    };

    return [
      makeEdge('e-in-res', 'UserInput', 'Researcher', 'Trigger'),
      makeEdge('e-res-wri', 'Researcher', 'Writer', 'Sources'),
      makeEdge('e-wri-edt', 'Writer', 'Editor', 'Draft'),
      makeEdge('e-edt-fc', 'Editor', 'Fact-Checker', 'Approved'),
      makeEdge('e-fc-out', 'Fact-Checker', 'FinalOutput', 'Verified', { color: '#10b981' }),
      makeEdge('e-fc-hum', 'Fact-Checker', 'HumanReview', 'Max Revisions', {
        isFeedback: true,
        color: '#f59e0b',
      }),
      makeEdge('e-edt-wri', 'Editor', 'Writer', 'Editor Rejection', {
        isFeedback: true,
        color: '#f59e0b',
        sourceHandle: 'bottom',
        targetHandle: 'top',
      }),
      makeEdge('e-fc-wri', 'Fact-Checker', 'Writer', 'Claim Correction', {
        isFeedback: true,
        color: '#ef4444',
        sourceHandle: 'bottom',
        targetHandle: 'top',
      }),
      makeEdge('e-fc-res', 'Fact-Checker', 'Researcher', 'Need More Evidence', {
        isFeedback: true,
        color: '#0ea5e9',
        sourceHandle: 'bottom',
        targetHandle: 'top',
      }),
    ];
  }, [lastEdge, theme]);

  return (
    <div className="w-full h-[420px] rounded-xl border border-border-subtle bg-canvas overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeSelect?.(node)}
        fitView
        fitViewOptions={{ padding: 0.16 }}
        minZoom={0.45}
        maxZoom={1.4}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color={theme === 'dark' ? '#1f2433' : '#e4e4e7'}
          gap={20}
          size={1}
        />
        <Controls />
        <MiniMap
          nodeColor={(n) =>
            n.data?.isActive ? '#7c3aed' : theme === 'dark' ? '#272c3d' : '#d4d4d8'
          }
          maskColor={theme === 'dark' ? 'rgba(9, 11, 16, 0.7)' : 'rgba(250, 250, 250, 0.7)'}
        />
      </ReactFlow>
    </div>
  );
}
