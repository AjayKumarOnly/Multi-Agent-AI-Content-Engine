export const PLATFORMS = [
  { id: 'LinkedIn', label: 'LinkedIn', maxChars: 3000, description: 'Professional long-form & carousels' },
  { id: 'X', label: 'X (Twitter)', maxChars: 280, description: 'Concise posts & multi-post threads' },
  { id: 'Blog', label: 'Blog', maxChars: 15000, description: 'Structured technical & editorial articles' },
];

export const TONES = [
  { id: 'Professional', label: 'Professional' },
  { id: 'Technical', label: 'Technical' },
  { id: 'Educational', label: 'Educational' },
  { id: 'Conversational', label: 'Conversational' },
];

export const LENGTHS = [
  { id: 'Short', label: 'Short', hint: '~150–300 words' },
  { id: 'Medium', label: 'Medium', hint: '~400–700 words' },
  { id: 'Long', label: 'Long', hint: '~900–1,500 words' },
];

export const AI_MODELS = [
  { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', provider: 'Google', tier: 'Reasoning' },
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', provider: 'Google', tier: 'Fast' },
  { id: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI', tier: 'Flagship' },
  { id: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', provider: 'Anthropic', tier: 'Editorial' },
];

export const AGENT_METADATA = {
  Researcher: {
    id: 'Researcher',
    name: 'Researcher Agent',
    role: 'Retrieves external evidence, statistics, and source URLs',
    color: 'sky',
  },
  Writer: {
    id: 'Writer',
    name: 'Writer Agent',
    role: 'Drafts platform-tailored content and applies revision feedback',
    color: 'violet',
  },
  Editor: {
    id: 'Editor',
    name: 'Editor Agent',
    role: 'Reviews grammar, clarity, tone, and structural coherence',
    color: 'amber',
  },
  'Fact-Checker': {
    id: 'Fact-Checker',
    name: 'Fact-Checker Agent',
    role: 'Validates factual claims against supporting research citations',
    color: 'emerald',
  },
};

export const WORKFLOW_STATUS = {
  PENDING: 'Pending',
  RUNNING: 'Running',
  COMPLETED: 'Completed',
  REVISING: 'Revising',
  FAILED: 'Failed',
  HUMAN_REVIEW: 'Human Review Required',
};

export const CLAIM_STATUS = {
  VERIFIED: 'Verified',
  UNSUPPORTED: 'Unsupported',
  UNRESOLVED: 'Unresolved',
};

export const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: 'LayoutDashboard' },
  { path: '/generate', label: 'Generate Content', icon: 'Sparkles' },
  { path: '/workflow', label: 'Agent Workflow', icon: 'GitBranch' },
  { path: '/history', label: 'Content History', icon: 'History' },
  { path: '/analytics', label: 'Performance Analytics', icon: 'BarChart3' },
  { path: '/benchmarking', label: 'Benchmarking', icon: 'Scale' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];
