import api from './api';

const productivityService = {
    getProductivity: async () => {
        const response = await api.get('/productivity');
        return response.data;
    },
    getTodayProductivity: async () => {
        const response = await api.get('/productivity/today');
        return response.data;
    }
};

export default productivityService;
