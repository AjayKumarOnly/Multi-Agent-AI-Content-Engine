import apiClient, { USE_MOCK_API } from './api';
import { DEFAULT_BENCHMARK_RESULT } from '../mocks/mockData';

export const benchmarkService = {
  async getLatestBenchmark() {
    if (!USE_MOCK_API) {
      const { data } = await apiClient.get('/benchmarks/latest');
      return data;
    }
    return { ...DEFAULT_BENCHMARK_RESULT, isDemoData: true };
  },

  async runBenchmark({ topic, criteria }) {
    if (!USE_MOCK_API) {
      const { data } = await apiClient.post('/benchmarks/run', { topic, criteria });
      return data;
    }

    await new Promise((r) => setTimeout(r, 1400));

    // Deterministic, realistic variation based on topic length so results feel authentic
    // and reflect real trade-offs (multi-agent improves accuracy/research, but costs more tokens/latency).
    const seed = (topic.length % 7) - 3;
    return {
      topic,
      criteria,
      ranAt: new Date().toISOString(),
      isDemoData: true,
      singlePrompt: {
        factualAccuracy: Number((77.5 + seed * 0.8).toFixed(1)),
        contentQuality: Number((80.5 + seed * 0.6).toFixed(1)),
        tokens: 2080 + seed * 90,
        latency: Number((4.4 + seed * 0.2).toFixed(1)),
        cost: Number((0.011 + seed * 0.0005).toFixed(4)),
        researchCoverage: Number((30.0 + seed * 1.5).toFixed(1)),
        unsupportedClaimRate: Number((16.8 - seed * 0.6).toFixed(1)),
        preview: `Single-Prompt Output for "${topic}":\n\nOrganizations adopting ${topic} often report rapid productivity gains and streamlined operations. By combining modern LLMs with domain prompts, teams can generate polished drafts in seconds.\n\nIndustry surveys indicate significant cost reductions across engineering and marketing workflows when teams standardize on single-pass generation.`,
      },
      multiAgent: {
        factualAccuracy: Number((95.8 + seed * 0.4).toFixed(1)),
        contentQuality: Number((93.2 + seed * 0.5).toFixed(1)),
        tokens: 8240 + seed * 240,
        latency: Number((17.6 + seed * 0.5).toFixed(1)),
        cost: Number((0.041 + seed * 0.0015).toFixed(4)),
        researchCoverage: Number((90.5 + seed * 0.8).toFixed(1)),
        unsupportedClaimRate: Number((2.4 - seed * 0.2).toFixed(1)),
        preview: `Multi-Agent Verified Output for "${topic}":\n\nEvaluation criteria: ${criteria}\n\n1. Grounded Context (Researcher): Anchors "${topic}" in retrieved technical documentation and peer-reviewed benchmarks rather than parametric memory.\n2. Structured Synthesis (Writer + Editor): Shapes the narrative for clarity and removes unsubstantiated superlatives.\n3. Claim Audit (Fact-Checker): Verifies each quantitative statement against source snippets, reducing unsupported claims to <3%.\n\nTrade-off: Higher token consumption and end-to-end latency in exchange for auditable factual reliability.`,
      },
    };
  },
};
