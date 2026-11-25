import { useState } from 'react';
import { Play, RotateCcw, Square, Info } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { DemoBanner } from '../components/common/DemoBanner';
import { AgentWorkflowGraph } from '../components/workflow/AgentWorkflowGraph';
import { ExecutionLogsPanel } from '../components/logs/ExecutionLogsPanel';
import { useWorkflowExecution } from '../hooks/useWorkflowExecution';
import { AGENT_METADATA } from '../constants';

export function WorkflowPage() {
  const [scenario, setScenario] = useState('editor_revision');
  const [selectedNodeId, setSelectedNodeId] = useState('Researcher');
  const {
    isRunning,
    agentStates,
    logs,
    activeAgent,
    lastEdge,
    progress,
    start,
    cancel,
    reset,
  } = useWorkflowExecution();

  const handleRunSimulation = () => {
    start({
      topic: 'Stateful Multi-Agent Verification Loops in LangGraph',
      platform: 'LinkedIn',
      tone: 'Technical',
      maxRevisions: scenario === 'human_review' ? 2 : 3,
      scenario,
    });
  };

  const selectedAgentMeta = AGENT_METADATA[selectedNodeId];
  const selectedAgentState = agentStates[selectedNodeId];

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink-primary">
            Interactive Agent Workflow
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Inspect cyclic LangGraph routing, conditional feedback loops, and per-agent telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            disabled={isRunning}
            aria-label="Select workflow simulation scenario"
            className="h-9 px-3 rounded-lg border border-border-subtle bg-canvas-surface text-xs text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="editor_revision">Scenario: Editor Rejection → Writer</option>
            <option value="fact_check_loop">Scenario: Fact-Check Failure → Writer</option>
            <option value="happy_path">Scenario: Direct Approval (0 Loops)</option>
            <option value="human_review">Scenario: Max Revisions → Human Review</option>
          </select>

          {!isRunning ? (
            <Button onClick={handleRunSimulation}>
              <Play className="w-3.5 h-3.5" />
              Simulate Execution
            </Button>
          ) : (
            <Button variant="danger" onClick={cancel}>
              <Square className="w-3.5 h-3.5" />
              Stop
            </Button>
          )}

          <Button variant="secondary" onClick={reset} disabled={isRunning}>
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        </div>
      </div>

      <DemoBanner
        label="Interactive Workflow Simulator"
        description="Click any agent node to inspect its execution state, or run a simulation to watch active nodes and conditional feedback edges animate in real time."
      />

      {/* React Flow Canvas + Node Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-9 space-y-2">
          <AgentWorkflowGraph
            agentStates={agentStates}
            activeAgent={activeAgent}
            lastEdge={lastEdge}
            onNodeSelect={(node) => {
              if (AGENT_METADATA[node.id]) setSelectedNodeId(node.id);
            }}
          />
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink-muted px-1">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-zinc-500 inline-block" /> Primary Forward Flow
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-amber-500 border-b border-dashed inline-block" /> Editor / Escalation Loop
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-500 inline-block" /> Fact-Check Correction
              </span>
            </div>
            <span className="font-mono">Progress: {progress}%</span>
          </div>
        </div>

        <Card
          title={selectedAgentMeta?.name || 'Agent Inspector'}
          subtitle="Click a node in the graph to inspect"
          className="xl:col-span-3"
        >
          {selectedAgentMeta && selectedAgentState ? (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Status</span>
                <StatusBadge status={selectedAgentState.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Duration</span>
                <span className="font-mono text-ink-primary">
                  {selectedAgentState.duration}s
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Tokens Consumed</span>
                <span className="font-mono text-ink-primary">
                  {selectedAgentState.tokens.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Revisions Triggered</span>
                <span className="font-mono text-ink-primary">
                  {selectedAgentState.revisions}
                </span>
              </div>
              <div className="pt-2 border-t border-border-subtle">
                <p className="text-[11px] font-medium text-ink-primary mb-1 flex items-center gap-1">
                  <Info className="w-3 h-3 text-violet-400" /> Role
                </p>
                <p className="text-[11px] text-ink-secondary leading-relaxed">
                  {selectedAgentMeta.role}
                </p>
              </div>
              {selectedAgentState.details && (
                <div className="pt-2 border-t border-border-subtle">
                  <p className="text-[11px] font-medium text-ink-primary mb-1">
                    Latest Operation
                  </p>
                  <p className="text-[11px] text-ink-secondary leading-relaxed">
                    {selectedAgentState.details}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-ink-muted">Select an agent node to inspect.</p>
          )}
        </Card>
      </div>

      {/* Real-Time Execution Logs */}
      <ExecutionLogsPanel logs={logs} title="Workflow Execution Logs" />
    </div>
  );
}
