import api from './api';

const dashboardService = {
  getDashboardData: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error.response?.data?.message || error.message;
    }
  },
};

export default dashboardService;
