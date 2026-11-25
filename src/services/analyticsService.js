import apiClient, { USE_MOCK_API } from './api';
import { ANALYTICS_DATASETS } from '../mocks/mockData';

export const analyticsService = {
  async getMetrics({ dateRange = '7d', agent = 'All' } = {}) {
    if (!USE_MOCK_API) {
      const { data } = await apiClient.get('/analytics/performance', {
        params: { dateRange, agent },
      });
      return data;
    }

    await new Promise((r) => setTimeout(r, 250));
    const dataset = ANALYTICS_DATASETS[dateRange] || ANALYTICS_DATASETS['7d'];
    return {
      ...dataset,
      isDemoData: true,
      appliedAgentFilter: agent,
    };
  },
};
