import { useCallback, useEffect, useRef, useState } from 'react';
import {
  cancelWorkflowExecution,
  startWorkflowGeneration,
  subscribeToWorkflowStream,
} from '../services/workflowService';

const INITIAL_AGENT_STATES = {
  Researcher: { status: 'Pending', duration: 0, tokens: 0, revisions: 0, details: '' },
  Writer: { status: 'Pending', duration: 0, tokens: 0, revisions: 0, details: '' },
  Editor: { status: 'Pending', duration: 0, tokens: 0, revisions: 0, details: '' },
  'Fact-Checker': { status: 'Pending', duration: 0, tokens: 0, revisions: 0, details: '' },
};

export function useWorkflowExecution() {
  const [isRunning, setIsRunning] = useState(false);
  const [workflowId, setWorkflowId] = useState(null);
  const [agentStates, setAgentStates] = useState(INITIAL_AGENT_STATES);
  const [logs, setLogs] = useState([]);
  const [activeAgent, setActiveAgent] = useState(null);
  const [lastEdge, setLastEdge] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const unsubscribeRef = useRef(null);
  const prevAgentRef = useRef('UserInput');

  const reset = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setIsRunning(false);
    setWorkflowId(null);
    setAgentStates(INITIAL_AGENT_STATES);
    setLogs([]);
    setActiveAgent(null);
    setLastEdge(null);
    setResult(null);
    setError(null);
    setProgress(0);
    prevAgentRef.current = 'UserInput';
  }, []);

  const start = useCallback(async (config) => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    setIsRunning(true);
    setError(null);
    setResult(null);
    setLogs([]);
    setAgentStates(INITIAL_AGENT_STATES);
    setActiveAgent('Researcher');
    setLastEdge('UserInput->Researcher');
    setProgress(10);
    prevAgentRef.current = 'UserInput';

    try {
      const started = await startWorkflowGeneration(config);
      setWorkflowId(started.workflowId);

      const unsub = subscribeToWorkflowStream(started.workflowId, config, {
        onEvent: (evt) => {
          setLogs((prev) => [...prev, evt]);

          if (evt.agent) {
            setActiveAgent(evt.agent);
            if (prevAgentRef.current && prevAgentRef.current !== evt.agent) {
              setLastEdge(`${prevAgentRef.current}->${evt.agent}`);
            }
            if (evt.status === 'Completed' || evt.status === 'Revising') {
              prevAgentRef.current = evt.agent;
            }

            setAgentStates((prev) => {
              const current = prev[evt.agent] || INITIAL_AGENT_STATES.Researcher;
              return {
                ...prev,
                [evt.agent]: {
                  status: evt.status,
                  duration: evt.duration ? Number((current.duration + evt.duration).toFixed(1)) : current.duration,
                  tokens: evt.tokens ? current.tokens + evt.tokens : current.tokens,
                  revisions: evt.revisionDelta ? current.revisions + evt.revisionDelta : current.revisions,
                  details: evt.operation || current.details,
                },
              };
            });

            const order = { Researcher: 25, Writer: 50, Editor: 75, 'Fact-Checker': 92 };
            setProgress((p) => Math.max(p, order[evt.agent] || p));
          }
        },
        onComplete: (artifact) => {
          setIsRunning(false);
          setActiveAgent(
            artifact.status === 'Human Review Required' ? 'HumanReview' : 'FinalOutput'
          );
          setLastEdge(
            artifact.status === 'Human Review Required'
              ? 'Fact-Checker->HumanReview'
              : 'Fact-Checker->FinalOutput'
          );
          setProgress(100);
          setResult(artifact);
        },
        onError: (err) => {
          setIsRunning(false);
          setError(err?.message || 'Workflow execution failed.');
        },
      });

      unsubscribeRef.current = unsub;
    } catch (err) {
      setIsRunning(false);
      setError(err?.message || 'Unable to start workflow.');
    }
  }, []);

  const cancel = useCallback(async () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    if (workflowId) {
      await cancelWorkflowExecution(workflowId);
    }
    setIsRunning(false);
    setLogs((prev) => [
      ...prev,
      {
        id: `evt_cancel_${Date.now()}`,
        timestamp: new Date().toISOString(),
        agent: activeAgent || 'System',
        status: 'Failed',
        operation: 'Execution cancelled by user.',
      },
    ]);
  }, [workflowId, activeAgent]);

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, []);

  return {
    isRunning,
    workflowId,
    agentStates,
    logs,
    activeAgent,
    lastEdge,
    result,
    setResult,
    error,
    progress,
    start,
    cancel,
    reset,
  };
}
