export const DEMO_USER = {
  id: 'usr_01J9X',
  name: 'Alex Rivera',
  email: 'alex.rivera@contentengine.ai',
  role: 'Staff AI Engineer',
  avatarInitials: 'AR',
};

export const OVERVIEW_ACTIVITY_SERIES = [
  { date: 'Nov 19', posts: 14, workflows: 16, accuracy: 93.2 },
  { date: 'Nov 20', posts: 19, workflows: 21, accuracy: 94.8 },
  { date: 'Nov 21', posts: 12, workflows: 14, accuracy: 92.5 },
  { date: 'Nov 22', posts: 24, workflows: 26, accuracy: 95.6 },
  { date: 'Nov 23', posts: 28, workflows: 30, accuracy: 96.1 },
  { date: 'Nov 24', posts: 22, workflows: 24, accuracy: 94.9 },
  { date: 'Nov 25', posts: 31, workflows: 33, accuracy: 96.4 },
];

export const AGENT_OVERVIEW_STATS = [
  {
    agent: 'Researcher',
    avgDuration: 4.8,
    successRate: 98.4,
    avgTokens: 1840,
    rejectionRate: 0,
    status: 'Healthy',
  },
  {
    agent: 'Writer',
    avgDuration: 6.2,
    successRate: 96.8,
    avgTokens: 3420,
    rejectionRate: 0,
    status: 'Healthy',
  },
  {
    agent: 'Editor',
    avgDuration: 3.1,
    successRate: 97.2,
    avgTokens: 1490,
    rejectionRate: 18.5,
    status: 'Healthy',
  },
  {
    agent: 'Fact-Checker',
    avgDuration: 4.4,
    successRate: 95.9,
    avgTokens: 1680,
    rejectionRate: 11.2,
    status: 'Healthy',
  },
];

export const INITIAL_CONTENT_HISTORY = [
  {
    id: 'cnt_9042',
    title: 'Why LangGraph State Machines Outperform Linear Prompt Chains in Production',
    platform: 'LinkedIn',
    tone: 'Technical',
    length: 'Medium',
    model: 'gemini-2.5-pro',
    audience: 'Staff Engineers & AI Architects',
    createdAt: '2026-11-25T11:42:00Z',
    status: 'Completed',
    qualityScore: 95,
    factualAccuracy: 97,
    executionTime: 18.4,
    tokens: { input: 5120, output: 3310, total: 8430 },
    cost: 0.042,
    revisions: 1,
    content: `Linear prompt chains break the moment an LLM hallucinates a statistic or misses an edge case.

In production AI systems, reliability doesn't come from a cleverer single prompt—it comes from stateful orchestration with explicit verification gates.

Here is what we observed after migrating our content pipeline to a 4-agent LangGraph state machine:

1. Separation of Retrieval & Synthesis
Our Researcher Agent isolates web retrieval (Tavily) from drafting. Every claim is anchored to a source URL before a single sentence is written.

2. Adversarial Editorial Loops
Instead of accepting the first draft, the Editor Agent evaluates structural clarity, audience fit, and tone—routing weak drafts back to the Writer with structured diffs.

3. Deterministic Fact-Checking Gates
The Fact-Checker Agent cross-references every quantitative claim against retrieved citations. Unsupported claims trigger an automatic correction loop rather than silent publication.

Result across 150+ production runs:
• Unsupported claim rate dropped from 14.2% to 2.1%
• Factual accuracy averaged 96.4%
• Human review escalations stayed under 4%

Orchestration > Prompt Engineering.

How are you handling verification loops in your agentic workflows?

#AIEngineering #LangGraph #MultiAgentSystems #LLMProduction`,
    citations: [
      {
        id: 'ref-1',
        title: 'LangGraph Stateful Multi-Agent Workflows Documentation',
        url: 'https://langchain-ai.github.io/langgraph/',
        domain: 'langchain-ai.github.io',
        snippet: 'Cyclic graph execution enables reflection, supervisor routing, and human-in-the-loop checkpoints.',
      },
      {
        id: 'ref-2',
        title: 'Evaluating Factuality in Retrieval-Augmented Generation Systems',
        url: 'https://arxiv.org/abs/2404.12345',
        domain: 'arxiv.org',
        snippet: 'Independent claim-verification agents reduce unsupported assertions by 78–85% compared to single-pass generation.',
      },
    ],
    factCheckReport: {
      verifiedCount: 4,
      unsupportedCount: 0,
      unresolvedCount: 0,
      claims: [
        {
          id: 'c1',
          claim: 'Stateful orchestration with cyclic graphs enables explicit verification gates and reflection loops.',
          status: 'Verified',
          evidence: 'Confirmed via LangGraph architecture docs (ref-1).',
        },
        {
          id: 'c2',
          claim: 'Independent claim-verification agents substantially reduce unsupported assertions compared to single-pass generation.',
          status: 'Verified',
          evidence: 'Supported by RAG factuality benchmark study (ref-2).',
        },
        {
          id: 'c3',
          claim: 'Internal benchmark telemetry: unsupported claim rate dropped from 14.2% to 2.1% across 150+ runs.',
          status: 'Verified',
          evidence: 'Matched against workspace execution telemetry dataset.',
        },
        {
          id: 'c4',
          claim: 'Human review escalations stayed under 4% with max_revisions=3.',
          status: 'Verified',
          evidence: 'Confirmed by workflow completion logs (3.8% escalation rate).',
        },
      ],
    },
    revisionHistory: [
      {
        round: 1,
        agent: 'Editor',
        decision: 'Revision Requested',
        summary: 'Tighten opening hook and replace passive voice in bullet 2 with concrete engineering outcomes.',
        timestamp: '2026-11-25T11:41:48Z',
      },
      {
        round: 2,
        agent: 'Editor',
        decision: 'Approved',
        summary: 'Structure, technical precision, and LinkedIn cadence meet publication threshold.',
        timestamp: '2026-11-25T11:41:55Z',
      },
      {
        round: 2,
        agent: 'Fact-Checker',
        decision: 'Approved',
        summary: 'All 4 quantitative and architectural claims verified against retrieved sources.',
        timestamp: '2026-11-25T11:42:00Z',
      },
    ],
  },
  {
    id: 'cnt_9041',
    title: 'Thread: 5 Lessons from Running Hybrid Spring Boot + FastAPI AI Microservices',
    platform: 'X',
    tone: 'Conversational',
    length: 'Short',
    model: 'gemini-2.5-flash',
    audience: 'Backend & Full-Stack Developers',
    createdAt: '2026-11-25T09:15:00Z',
    status: 'Completed',
    qualityScore: 91,
    factualAccuracy: 94,
    executionTime: 13.8,
    tokens: { input: 3640, output: 2180, total: 5820 },
    cost: 0.019,
    revisions: 0,
    posts: [
      '1/5 Building an AI product? You probably don’t want your auth, billing, and rate-limiting living inside Python notebooks. Here is why a Spring Boot + FastAPI split works so well in production. 🧵',
      '2/5 Spring Boot handles the boring-but-critical enterprise layer: JWT auth, RBAC, Postgres persistence, and resilient API gateways with predictable JVM memory.',
      '3/5 Python FastAPI stays laser-focused on the AI engine: LangGraph state machines, Tavily search tools, and async token streaming over SSE.',
      '4/5 The secret glue? Server-Sent Events (SSE). Spring Boot proxies FastAPI’s event stream straight to React so users see every agent transition in real time.',
      '5/5 Keep your API keys (Gemini, Tavily) strictly in backend env vaults—never in client bundles. Clean boundaries = happier security audits.',
    ],
    content: `1/5 Building an AI product? You probably don’t want your auth, billing, and rate-limiting living inside Python notebooks. Here is why a Spring Boot + FastAPI split works so well in production. 🧵\n\n2/5 Spring Boot handles the boring-but-critical enterprise layer: JWT auth, RBAC, Postgres persistence, and resilient API gateways with predictable JVM memory.\n\n3/5 Python FastAPI stays laser-focused on the AI engine: LangGraph state machines, Tavily search tools, and async token streaming over SSE.\n\n4/5 The secret glue? Server-Sent Events (SSE). Spring Boot proxies FastAPI’s event stream straight to React so users see every agent transition in real time.\n\n5/5 Keep your API keys (Gemini, Tavily) strictly in backend env vaults—never in client bundles. Clean boundaries = happier security audits.`,
    citations: [
      {
        id: 'ref-3',
        title: 'FastAPI Server-Sent Events & Async Streaming Guide',
        url: 'https://fastapi.tiangolo.com/advanced/custom-response/',
        domain: 'fastapi.tiangolo.com',
        snippet: 'StreamingResponse enables low-overhead server-to-client event streams over HTTP.',
      },
    ],
    factCheckReport: {
      verifiedCount: 2,
      unsupportedCount: 0,
      unresolvedCount: 1,
      claims: [
        {
          id: 'c1',
          claim: 'FastAPI supports async Server-Sent Events via StreamingResponse.',
          status: 'Verified',
          evidence: 'Confirmed in FastAPI official documentation (ref-3).',
        },
        {
          id: 'c2',
          claim: 'API credentials should remain on backend servers rather than frontend bundles.',
          status: 'Verified',
          evidence: 'Standard OWASP API security practice.',
        },
        {
          id: 'c3',
          claim: 'Spring Boot provides predictable JVM memory for gateway workloads.',
          status: 'Unresolved',
          evidence: 'Qualitative architectural observation; depends on heap tuning.',
        },
      ],
    },
    revisionHistory: [
      {
        round: 1,
        agent: 'Editor',
        decision: 'Approved',
        summary: 'All 5 posts fit within 280-character X limit with clear narrative arc.',
        timestamp: '2026-11-25T09:14:52Z',
      },
      {
        round: 1,
        agent: 'Fact-Checker',
        decision: 'Approved',
        summary: 'Core technical claims verified; 1 qualitative claim flagged as unresolved.',
        timestamp: '2026-11-25T09:15:00Z',
      },
    ],
  },
  {
    id: 'cnt_9039',
    title: 'Designing Deterministic Fact-Checking Loops for Enterprise AI Content',
    platform: 'Blog',
    tone: 'Educational',
    length: 'Long',
    model: 'claude-3.5-sonnet',
    audience: 'Engineering Leaders & ML Platform Teams',
    createdAt: '2026-11-24T17:30:00Z',
    status: 'Completed',
    qualityScore: 96,
    factualAccuracy: 98,
    executionTime: 24.6,
    tokens: { input: 6890, output: 4920, total: 11810 },
    cost: 0.068,
    revisions: 2,
    content: `# Designing Deterministic Fact-Checking Loops for Enterprise AI Content

Enterprise content teams face a recurring dilemma: generative models accelerate drafting by an order of magnitude, yet a single fabricated citation or misquoted benchmark can erode brand trust overnight.

## Why Single-Pass Generation Fails Verification

When a single LLM call is asked to simultaneously plan, draft, polish, and verify facts, attention is split across competing objectives. Empirical evaluations consistently show that self-critique within the same context window suffers from confirmation bias.

## The Four-Agent Verification Architecture

By decomposing the pipeline into four isolated roles—**Researcher**, **Writer**, **Editor**, and **Fact-Checker**—each stage operates with a narrow, testable contract:

- **Researcher Agent**: Executes grounded web queries and returns structured source snippets with canonical URLs.
- **Writer Agent**: Synthesizes prose strictly from the research bundle and target style constraints.
- **Editor Agent**: Audits readability, tone alignment, and structural flow without altering factual claims.
- **Fact-Checker Agent**: Extracts atomic claims from the draft and classifies each as *Verified*, *Unsupported*, or *Unresolved*.

## Bounded Revision Loops & Human Escalation

Unbounded agent loops risk infinite token burn. Setting a strict \`max_revisions\` threshold (typically 2–3 rounds) ensures that persistent factual conflicts route cleanly to a **Human Review Required** state rather than looping indefinitely.`,
    citations: [
      {
        id: 'ref-4',
        title: 'Self-Correction Limitations in Large Language Models',
        url: 'https://arxiv.org/abs/2310.01798',
        domain: 'arxiv.org',
        snippet: 'Intrinsic self-correction without external feedback often degrades or fails to fix factual errors.',
      },
    ],
    factCheckReport: {
      verifiedCount: 3,
      unsupportedCount: 0,
      unresolvedCount: 0,
      claims: [
        {
          id: 'c1',
          claim: 'Intrinsic self-correction without external grounding struggles to reliably fix factual errors.',
          status: 'Verified',
          evidence: 'Confirmed by arXiv:2310.01798 (ref-4).',
        },
        {
          id: 'c2',
          claim: 'Bounded max_revisions thresholds prevent infinite agent loops and excessive token consumption.',
          status: 'Verified',
          evidence: 'Standard state-machine termination guarantee.',
        },
        {
          id: 'c3',
          claim: 'Decomposing research, writing, editing, and fact-checking isolates responsibilities.',
          status: 'Verified',
          evidence: 'Confirmed against system architecture specification.',
        },
      ],
    },
    revisionHistory: [
      {
        round: 1,
        agent: 'Fact-Checker',
        decision: 'Revision Requested',
        summary: 'Draft cited an unverified percentage; routed back to Writer to ground against arXiv:2310.01798.',
        timestamp: '2026-11-24T17:29:35Z',
      },
      {
        round: 2,
        agent: 'Editor',
        decision: 'Approved',
        summary: 'Clarity and section transitions verified.',
        timestamp: '2026-11-24T17:29:50Z',
      },
      {
        round: 2,
        agent: 'Fact-Checker',
        decision: 'Approved',
        summary: 'All claims verified.',
        timestamp: '2026-11-24T17:30:00Z',
      },
    ],
  },
  {
    id: 'cnt_9035',
    title: 'Q4 AI Infrastructure Cost Optimization Playbook',
    platform: 'LinkedIn',
    tone: 'Professional',
    length: 'Medium',
    model: 'gpt-4o',
    audience: 'CTOs & VP Engineering',
    createdAt: '2026-11-23T14:05:00Z',
    status: 'Human Review Required',
    qualityScore: 79,
    factualAccuracy: 82,
    executionTime: 29.2,
    tokens: { input: 6100, output: 3800, total: 9900 },
    cost: 0.054,
    revisions: 3,
    content: `AI inference costs can quietly outpace cloud compute budgets if model routing isn't intentional.

Three practical levers engineering teams are using right now:
1. Tiered model routing (Flash-class models for classification/editing, Frontier models for synthesis)
2. Prompt prefix caching on static system instructions
3. Strict max-revision caps on agentic loops

[Pending human sign-off on Q4 benchmark figures before publishing]`,
    citations: [
      {
        id: 'ref-5',
        title: 'LLM Inference Cost Optimization Patterns',
        url: 'https://platform.openai.com/docs/guides/prompt-caching',
        domain: 'platform.openai.com',
        snippet: 'Prompt caching reduces latency and input token costs for repeated system prefixes.',
      },
    ],
    factCheckReport: {
      verifiedCount: 2,
      unsupportedCount: 1,
      unresolvedCount: 1,
      claims: [
        {
          id: 'c1',
          claim: 'Prompt caching reduces input token costs for repeated system prefixes.',
          status: 'Verified',
          evidence: 'Confirmed via OpenAI Prompt Caching docs (ref-5).',
        },
        {
          id: 'c2',
          claim: 'Tiered model routing reduces blended inference cost.',
          status: 'Verified',
          evidence: 'Verified via model pricing schedules.',
        },
        {
          id: 'c3',
          claim: 'Specific Q4 industry-wide spend percentage figure requested in prompt.',
          status: 'Unsupported',
          evidence: 'No authoritative Q4 2026 spend report found in retrieved sources.',
        },
        {
          id: 'c4',
          claim: 'Max-revision caps bound worst-case token spend.',
          status: 'Unresolved',
          evidence: 'Depends on per-turn context window growth.',
        },
      ],
    },
    revisionHistory: [
      {
        round: 1,
        agent: 'Fact-Checker',
        decision: 'Revision Requested',
        summary: 'Removed unverified Q4 industry spend statistic.',
        timestamp: '2026-11-23T14:04:10Z',
      },
      {
        round: 2,
        agent: 'Fact-Checker',
        decision: 'Revision Requested',
        summary: 'Writer re-introduced unverified figure; routed to Researcher.',
        timestamp: '2026-11-23T14:04:35Z',
      },
      {
        round: 3,
        agent: 'Fact-Checker',
        decision: 'Escalated',
        summary: 'Maximum revision rounds (3) reached. Escalated to Human Review Required.',
        timestamp: '2026-11-23T14:05:00Z',
      },
    ],
  },
];

export const RECENT_WORKFLOW_EXECUTIONS = [
  {
    id: 'wf_8821',
    topic: 'Why LangGraph State Machines Outperform Linear Prompt Chains',
    platform: 'LinkedIn',
    status: 'Completed',
    duration: 18.4,
    revisions: 1,
    tokens: 8430,
    cost: 0.042,
    timestamp: '2026-11-25T11:42:00Z',
  },
  {
    id: 'wf_8820',
    topic: 'Hybrid Spring Boot + FastAPI AI Microservices',
    platform: 'X',
    status: 'Completed',
    duration: 13.8,
    revisions: 0,
    tokens: 5820,
    cost: 0.019,
    timestamp: '2026-11-25T09:15:00Z',
  },
  {
    id: 'wf_8819',
    topic: 'Deterministic Fact-Checking Loops for Enterprise AI',
    platform: 'Blog',
    status: 'Completed',
    duration: 24.6,
    revisions: 2,
    tokens: 11810,
    cost: 0.068,
    timestamp: '2026-11-24T17:30:00Z',
  },
  {
    id: 'wf_8818',
    topic: 'Q4 AI Infrastructure Cost Optimization Playbook',
    platform: 'LinkedIn',
    status: 'Human Review Required',
    duration: 29.2,
    revisions: 3,
    tokens: 9900,
    cost: 0.054,
    timestamp: '2026-11-23T14:05:00Z',
  },
];

export const ANALYTICS_DATASETS = {
  '7d': {
    summary: {
      totalRequests: 642,
      avgLatency: 17.8,
      inputTokens: 894200,
      outputTokens: 541800,
      costPerPost: 0.039,
      successRate: 94.6,
      failureRate: 1.8,
      humanReviewRate: 3.6,
      avgRevisions: 1.14,
      factualAccuracy: 95.8,
    },
    latencyTrend: [
      { day: 'Nov 19', apiLatency: 19.2, researcher: 5.1, writer: 6.8, editor: 3.2, factChecker: 4.1 },
      { day: 'Nov 20', apiLatency: 18.4, researcher: 4.9, writer: 6.4, editor: 3.0, factChecker: 4.1 },
      { day: 'Nov 21', apiLatency: 17.9, researcher: 4.7, writer: 6.1, editor: 3.1, factChecker: 4.0 },
      { day: 'Nov 22', apiLatency: 17.1, researcher: 4.5, writer: 5.9, editor: 2.9, factChecker: 3.8 },
      { day: 'Nov 23', apiLatency: 18.8, researcher: 5.0, writer: 6.5, editor: 3.3, factChecker: 4.0 },
      { day: 'Nov 24', apiLatency: 16.9, researcher: 4.4, writer: 5.8, editor: 2.8, factChecker: 3.9 },
      { day: 'Nov 25', apiLatency: 16.4, researcher: 4.3, writer: 5.7, editor: 2.7, factChecker: 3.7 },
    ],
    tokenBreakdown: [
      { agent: 'Researcher', input: 240000, output: 85000 },
      { agent: 'Writer', input: 295000, output: 280000 },
      { agent: 'Editor', input: 185000, output: 94000 },
      { agent: 'Fact-Checker', input: 174200, output: 82800 },
    ],
    outcomeDistribution: [
      { name: 'Completed', value: 94.6, color: '#10b981' },
      { name: 'Human Review', value: 3.6, color: '#f59e0b' },
      { name: 'Failed', value: 1.8, color: '#ef4444' },
    ],
    rejectionRates: [
      { agent: 'Editor', rate: 18.5 },
      { agent: 'Fact-Checker', rate: 11.2 },
    ],
  },
  '30d': {
    summary: {
      totalRequests: 2480,
      avgLatency: 18.9,
      inputTokens: 3420000,
      outputTokens: 2090000,
      costPerPost: 0.042,
      successRate: 93.4,
      failureRate: 2.2,
      humanReviewRate: 4.4,
      avgRevisions: 1.28,
      factualAccuracy: 94.9,
    },
    latencyTrend: [
      { day: 'Wk 1', apiLatency: 20.4, researcher: 5.4, writer: 7.2, editor: 3.5, factChecker: 4.3 },
      { day: 'Wk 2', apiLatency: 19.6, researcher: 5.1, writer: 6.8, editor: 3.3, factChecker: 4.4 },
      { day: 'Wk 3', apiLatency: 18.3, researcher: 4.8, writer: 6.3, editor: 3.1, factChecker: 4.1 },
      { day: 'Wk 4', apiLatency: 17.4, researcher: 4.5, writer: 6.0, editor: 2.9, factChecker: 4.0 },
    ],
    tokenBreakdown: [
      { agent: 'Researcher', input: 910000, output: 330000 },
      { agent: 'Writer', input: 1140000, output: 1080000 },
      { agent: 'Editor', input: 710000, output: 365000 },
      { agent: 'Fact-Checker', input: 660000, output: 315000 },
    ],
    outcomeDistribution: [
      { name: 'Completed', value: 93.4, color: '#10b981' },
      { name: 'Human Review', value: 4.4, color: '#f59e0b' },
      { name: 'Failed', value: 2.2, color: '#ef4444' },
    ],
    rejectionRates: [
      { agent: 'Editor', rate: 20.1 },
      { agent: 'Fact-Checker', rate: 12.8 },
    ],
  },
  '90d': {
    summary: {
      totalRequests: 7120,
      avgLatency: 19.7,
      inputTokens: 9850000,
      outputTokens: 6120000,
      costPerPost: 0.045,
      successRate: 92.1,
      failureRate: 2.7,
      humanReviewRate: 5.2,
      avgRevisions: 1.39,
      factualAccuracy: 94.1,
    },
    latencyTrend: [
      { day: 'Sep', apiLatency: 21.3, researcher: 5.6, writer: 7.5, editor: 3.6, factChecker: 4.6 },
      { day: 'Oct', apiLatency: 19.8, researcher: 5.2, writer: 6.9, editor: 3.3, factChecker: 4.4 },
      { day: 'Nov', apiLatency: 18.0, researcher: 4.7, writer: 6.2, editor: 3.0, factChecker: 4.1 },
    ],
    tokenBreakdown: [
      { agent: 'Researcher', input: 2620000, output: 940000 },
      { agent: 'Writer', input: 3290000, output: 3160000 },
      { agent: 'Editor', input: 2040000, output: 1070000 },
      { agent: 'Fact-Checker', input: 1900000, output: 950000 },
    ],
    outcomeDistribution: [
      { name: 'Completed', value: 92.1, color: '#10b981' },
      { name: 'Human Review', value: 5.2, color: '#f59e0b' },
      { name: 'Failed', value: 2.7, color: '#ef4444' },
    ],
    rejectionRates: [
      { agent: 'Editor', rate: 21.8 },
      { agent: 'Fact-Checker', rate: 14.0 },
    ],
  },
};

export const DEFAULT_BENCHMARK_RESULT = {
  topic: 'How Retrieval-Augmented Generation Reduces LLM Hallucinations in Enterprise Search',
  criteria: 'Technical Accuracy, Source Grounding, Executive Readability',
  ranAt: '2026-11-25T10:30:00Z',
  singlePrompt: {
    factualAccuracy: 78.5,
    contentQuality: 81.0,
    tokens: 2150,
    latency: 4.6,
    cost: 0.011,
    researchCoverage: 32.0,
    unsupportedClaimRate: 16.4,
    preview: `Retrieval-Augmented Generation (RAG) is a technique that combines large language models with external knowledge bases to reduce hallucinations.\n\nBy retrieving relevant documents before generating a response, RAG grounds outputs in enterprise data. Studies show RAG can cut hallucinations by up to 90% in customer support and internal search deployments.\n\nKey benefits include fresher knowledge without retraining, lower infrastructure costs, and easier compliance.`,
  },
  multiAgent: {
    factualAccuracy: 96.2,
    contentQuality: 93.5,
    tokens: 8340,
    latency: 17.9,
    cost: 0.041,
    researchCoverage: 91.0,
    unsupportedClaimRate: 2.3,
    preview: `Enterprise search fails when generative models rely solely on parametric memory.\n\nRetrieval-Augmented Generation (RAG) addresses this by decoupling reasoning from knowledge storage—retrieving verifiable document chunks at query time before synthesis.\n\nIn a 4-agent verification pipeline:\n• Researcher grounds claims in indexed policy & benchmark sources (Lewis et al., NeurIPS 2020)\n• Writer structures the narrative for engineering decision-makers\n• Editor tightens clarity and removes speculative phrasing\n• Fact-Checker audits each claim against retrieved passages\n\nTrade-off: Multi-agent orchestration consumes ~3.9x more tokens and takes ~13s longer, but cuts unsupported claims from 16.4% to 2.3%.`,
  },
};
