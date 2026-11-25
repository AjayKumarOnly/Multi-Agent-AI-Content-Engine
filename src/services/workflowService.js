import apiClient, { API_BASE_URL, USE_MOCK_API } from './api';

/**
 * Starts a content generation workflow on the Spring Boot / LangGraph backend
 * or returns a simulated workflow ID in demo mode.
 */
export async function startWorkflowGeneration(config) {
  if (!USE_MOCK_API) {
    const { data } = await apiClient.post('/workflows/generate', config);
    return data;
  }
  return {
    workflowId: `wf_${Date.now().toString(36)}`,
    status: 'Running',
    startedAt: new Date().toISOString(),
  };
}

export async function cancelWorkflowExecution(workflowId) {
  if (!USE_MOCK_API) {
    const { data } = await apiClient.post(`/workflows/${workflowId}/cancel`);
    return data;
  }
  return { workflowId, status: 'Cancelled' };
}

/**
 * Subscribes to Server-Sent Events (SSE) for live agent execution updates.
 * In mock mode, emits realistic timed agent state transitions, logs, and final output.
 */
export function subscribeToWorkflowStream(workflowId, config, handlers) {
  const { onEvent, onComplete, onError } = handlers;

  if (!USE_MOCK_API) {
    const token = localStorage.getItem('maice_jwt_token');
    const url = `${API_BASE_URL}/workflows/${workflowId}/events${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (evt) => {
      try {
        const parsed = JSON.parse(evt.data);
        onEvent?.(parsed);
        if (parsed.type === 'WORKFLOW_COMPLETED' || parsed.type === 'HUMAN_REVIEW_REQUIRED') {
          eventSource.close();
          onComplete?.(parsed.payload);
        }
      } catch (err) {
        onError?.(err);
      }
    };

    eventSource.onerror = (err) => {
      eventSource.close();
      onError?.(err);
    };

    return () => eventSource.close();
  }

  // Simulated SSE stream
  let cancelled = false;
  const timers = [];
  const topic = config.topic || 'Multi-Agent AI Orchestration';
  const platform = config.platform || 'LinkedIn';
  const tone = config.tone || 'Technical';
  const maxRevisions = Number(config.maxRevisions ?? 2);
  const scenario = config.scenario || 'editor_revision'; // 'happy_path' | 'editor_revision' | 'fact_check_loop' | 'human_review'

  const emit = (delayMs, event) => {
    const id = setTimeout(() => {
      if (cancelled) return;
      onEvent?.({
        id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
        ...event,
      });
    }, delayMs);
    timers.push(id);
  };

  // Step 1: Researcher
  emit(250, {
    agent: 'Researcher',
    status: 'Running',
    operation: `Querying external knowledge & citations for "${topic}"`,
    tokens: 0,
    duration: 0,
  });

  emit(1400, {
    agent: 'Researcher',
    status: 'Completed',
    operation: 'Retrieved 4 authoritative sources and structured evidence snippets',
    tokens: 1820,
    duration: 3.9,
    researchFindings: [
      `Primary architecture reference on "${topic}" indexed with verified canonical URL.`,
      'Empirical benchmark data extracted: 78% reduction in unsupported claims with verification gates.',
      'Production latency & token overhead trade-offs documented from engineering case studies.',
    ],
  });

  // Step 2: Writer (Draft 1)
  emit(1650, {
    agent: 'Writer',
    status: 'Running',
    operation: `Drafting ${platform} content (${tone} tone, ${config.length || 'Medium'} length)`,
    tokens: 0,
    duration: 0,
  });

  emit(3000, {
    agent: 'Writer',
    status: 'Completed',
    operation: 'Draft v1 synthesized from research bundle',
    tokens: 3240,
    duration: 5.4,
  });

  // Step 3: Editor
  emit(3250, {
    agent: 'Editor',
    status: 'Running',
    operation: 'Auditing grammar, structural clarity, and platform cadence',
    tokens: 0,
    duration: 0,
  });

  if (scenario === 'editor_revision' || scenario === 'fact_check_loop' || scenario === 'human_review') {
    emit(4300, {
      agent: 'Editor',
      status: 'Revising',
      operation: 'Requested revision: strengthen opening hook and tighten section transitions',
      tokens: 1410,
      duration: 2.8,
      revisionDelta: 1,
      editorialFeedback:
        'Opening paragraph is overly generic. Lead with a concrete engineering failure mode and convert passive bullets into measurable outcomes.',
    });

    // Writer Revision 1
    emit(4600, {
      agent: 'Writer',
      status: 'Revising',
      operation: 'Applying Editor feedback (Revision Round 1)',
      tokens: 0,
      duration: 0,
    });

    emit(5800, {
      agent: 'Writer',
      status: 'Completed',
      operation: 'Draft v2 updated with sharper hook and concrete metrics',
      tokens: 1980,
      duration: 3.6,
    });

    emit(6050, {
      agent: 'Editor',
      status: 'Running',
      operation: 'Re-evaluating Draft v2 against editorial rubric',
      tokens: 0,
      duration: 0,
    });

    emit(6900, {
      agent: 'Editor',
      status: 'Completed',
      operation: 'Approved Draft v2 (Clarity 95/100, Tone Match 96/100)',
      tokens: 1120,
      duration: 2.1,
      editorialFeedback: 'Revision accepted. Structure and tone align with target audience.',
    });
  } else {
    emit(4300, {
      agent: 'Editor',
      status: 'Completed',
      operation: 'Approved Draft v1 (Clarity 94/100)',
      tokens: 1380,
      duration: 2.6,
      editorialFeedback: 'Draft meets editorial standards on first pass.',
    });
  }

  const fcStart = scenario === 'happy_path' ? 4550 : 7150;

  // Step 4: Fact-Checker
  emit(fcStart, {
    agent: 'Fact-Checker',
    status: 'Running',
    operation: 'Cross-referencing atomic claims against retrieved citations',
    tokens: 0,
    duration: 0,
  });

  if (scenario === 'fact_check_loop' || scenario === 'human_review') {
    emit(fcStart + 1200, {
      agent: 'Fact-Checker',
      status: 'Revising',
      operation: 'Detected 1 unsupported claim — routing back for grounding',
      tokens: 1620,
      duration: 3.8,
      revisionDelta: 1,
      factCheckResults: '2 claims Verified, 1 claim Unsupported (missing citation for percentage figure).',
    });

    if (scenario === 'human_review' && maxRevisions <= 2) {
      emit(fcStart + 2100, {
        agent: 'Fact-Checker',
        status: 'Failed',
        operation: `Maximum revision limit (${maxRevisions}) reached — Escalated to Human Review`,
        tokens: 840,
        duration: 1.9,
        errorMessage: 'Escalated to Human Review Required: unresolved factual claim after max revision rounds.',
      });

      const doneTimer = setTimeout(() => {
        if (cancelled) return;
        const result = buildGeneratedArtifact(config, 'Human Review Required', maxRevisions);
        onComplete?.(result);
      }, fcStart + 2400);
      timers.push(doneTimer);

      return () => {
        cancelled = true;
        timers.forEach(clearTimeout);
      };
    }

    emit(fcStart + 1500, {
      agent: 'Writer',
      status: 'Revising',
      operation: 'Grounding flagged claim against verified Researcher citation',
      tokens: 0,
      duration: 0,
    });

    emit(fcStart + 2500, {
      agent: 'Writer',
      status: 'Completed',
      operation: 'Draft v3 updated with verified attribution',
      tokens: 1150,
      duration: 2.4,
    });

    emit(fcStart + 2750, {
      agent: 'Fact-Checker',
      status: 'Running',
      operation: 'Re-verifying Draft v3 claims',
      tokens: 0,
      duration: 0,
    });

    emit(fcStart + 3650, {
      agent: 'Fact-Checker',
      status: 'Completed',
      operation: 'All claims verified against retrieved sources (Accuracy 97%)',
      tokens: 1190,
      duration: 2.3,
      factCheckResults: '3/3 claims Verified. 0 Unsupported. 0 Unresolved.',
    });

    const doneTimer = setTimeout(() => {
      if (cancelled) return;
      const result = buildGeneratedArtifact(config, 'Completed', 2);
      onComplete?.(result);
    }, fcStart + 3900);
    timers.push(doneTimer);
  } else {
    emit(fcStart + 1250, {
      agent: 'Fact-Checker',
      status: 'Completed',
      operation: 'All claims verified against retrieved sources (Accuracy 97%)',
      tokens: 1590,
      duration: 3.7,
      factCheckResults: '3/3 claims Verified. 0 Unsupported. 0 Unresolved.',
    });

    const doneTimer = setTimeout(() => {
      if (cancelled) return;
      const revisions = scenario === 'happy_path' ? 0 : 1;
      const result = buildGeneratedArtifact(config, 'Completed', revisions);
      onComplete?.(result);
    }, fcStart + 1500);
    timers.push(doneTimer);
  }

  return () => {
    cancelled = true;
    timers.forEach(clearTimeout);
  };
}

function buildGeneratedArtifact(config, status, revisions) {
  const topic = config.topic?.trim() || 'Multi-Agent AI Content Orchestration';
  const platform = config.platform || 'LinkedIn';
  const tone = config.tone || 'Technical';
  const audience = config.audience || 'Engineering Teams';
  const model = config.model || 'gemini-2.5-pro';
  const postCount = Number(config.numberOfPosts || 1);

  let content = '';
  let posts = [];

  if (platform === 'X') {
    const count = Math.max(3, Math.min(postCount || 4, 6));
    posts = [
      `1/${count} Most teams underestimate why ${topic} fails in single-prompt pipelines. Here is the architectural shift that fixes it. 🧵`,
      `2/${count} Separating retrieval (Researcher) from synthesis (Writer) ensures every statistic is anchored to a real URL before drafting begins.`,
      `3/${count} Adding an independent Editor + Fact-Checker gate catches tone drift and unsupported claims before they ever reach ${audience}.`,
      ...(count >= 4
        ? [
            `4/${count} Bounded revision loops (max ${config.maxRevisions || 2} rounds) prevent runaway token spend while escalating edge cases to human review.`,
          ]
        : []),
      ...(count >= 5
        ? [`5/${count} Result: higher factual precision, full auditability, and predictable inference cost per post.`]
        : []),
      ...(count >= 6 ? [`6/${count} Built with Spring Boot + FastAPI LangGraph + React SSE streaming.`] : []),
    ];
    content = posts.join('\n\n');
  } else if (platform === 'Blog') {
    content = `# ${topic}\n\n*Tailored for ${audience} • Tone: ${tone}*\n\n## Executive Summary\n\nModern AI content pipelines require more than single-shot prompting. By orchestrating four specialized agents—**Researcher**, **Writer**, **Editor**, and **Fact-Checker**—teams achieve verifiable accuracy without sacrificing editorial velocity.\n\n## Architectural Breakdown\n\n1. **Grounded Research**: External search isolates source gathering from text generation.\n2. **Iterative Editing**: Automated critique loops refine structure and ${tone.toLowerCase()} voice.\n3. **Claim Verification**: Atomic claims are audited against retrieved citations prior to release.\n\n## Key Takeaways for ${audience}\n\n- Anchor every quantitative statement to a retrievable source.\n- Enforce strict revision caps (${config.maxRevisions || 2} rounds) to bound latency and token cost.\n- Surface execution telemetry so reviewers can inspect every agent handoff.`;
  } else {
    content = `Most AI-generated content fails not because the model can't write—but because nothing verifies what it claims.\n\nWhen we approached "${topic}" for ${audience}, we ran it through a 4-agent orchestration pipeline:\n\n1. Researcher Agent gathered primary sources and verified citations.\n2. Writer Agent synthesized a ${tone.toLowerCase()} narrative tailored for ${platform}.\n3. Editor Agent refined clarity, structure, and pacing.\n4. Fact-Checker Agent audited every claim against retrieved evidence.\n\nThe result is content that is both publication-ready and auditable from first source to final word.\n\nWhat verification gates are you running in your AI workflows?\n\n#AIEngineering #MultiAgentSystems #ContentIntelligence`;
  }

  return {
    id: `cnt_${Date.now().toString(36)}`,
    title: topic,
    platform,
    tone,
    length: config.length || 'Medium',
    model,
    audience,
    createdAt: new Date().toISOString(),
    status,
    qualityScore: status === 'Human Review Required' ? 81 : 94,
    factualAccuracy: status === 'Human Review Required' ? 84 : 97,
    executionTime: status === 'Human Review Required' ? 21.4 : 16.8,
    tokens: { input: 4920, output: 3180, total: 8100 },
    cost: 0.039,
    revisions,
    posts: platform === 'X' ? posts : undefined,
    content,
    citations: [
      {
        id: 'ref-live-1',
        title: `Primary Reference: ${topic}`,
        url: 'https://arxiv.org/abs/2404.12345',
        domain: 'arxiv.org',
        snippet: 'Multi-agent verification reduces unsupported assertions compared to single-pass generation.',
      },
      {
        id: 'ref-live-2',
        title: 'Stateful Agent Orchestration Patterns',
        url: 'https://langchain-ai.github.io/langgraph/',
        domain: 'langchain-ai.github.io',
        snippet: 'Bounded cyclic graphs support editorial reflection and human-in-the-loop escalation.',
      },
    ],
    factCheckReport: {
      verifiedCount: status === 'Human Review Required' ? 2 : 3,
      unsupportedCount: status === 'Human Review Required' ? 1 : 0,
      unresolvedCount: 0,
      claims: [
        {
          id: 'lc-1',
          claim: 'Separating retrieval from synthesis anchors claims to verifiable URLs.',
          status: 'Verified',
          evidence: 'Confirmed via stateful agent orchestration reference (ref-live-2).',
        },
        {
          id: 'lc-2',
          claim: 'Independent fact-checking gates reduce unsupported assertions.',
          status: 'Verified',
          evidence: 'Confirmed via empirical verification benchmark (ref-live-1).',
        },
        {
          id: 'lc-3',
          claim:
            status === 'Human Review Required'
              ? 'Unverified external benchmark percentage referenced in prompt.'
              : 'Bounded revision limits prevent infinite token loops.',
          status: status === 'Human Review Required' ? 'Unsupported' : 'Verified',
          evidence:
            status === 'Human Review Required'
              ? 'No matching primary source retrieved within max revision rounds.'
              : 'Verified against workflow state-machine termination rules.',
        },
      ],
    },
    revisionHistory: [
      ...(revisions > 0
        ? [
            {
              round: 1,
              agent: 'Editor',
              decision: 'Revision Requested',
              summary: 'Tighten opening hook and emphasize concrete engineering outcomes.',
              timestamp: new Date(Date.now() - 5000).toISOString(),
            },
          ]
        : []),
      {
        round: revisions + 1,
        agent: 'Fact-Checker',
        decision: status === 'Human Review Required' ? 'Escalated' : 'Approved',
        summary:
          status === 'Human Review Required'
            ? 'Max revisions reached; flagged for human verification.'
            : 'All claims verified against retrieved citations.',
        timestamp: new Date().toISOString(),
      },
    ],
  };
}
