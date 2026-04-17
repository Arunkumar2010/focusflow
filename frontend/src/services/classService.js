import api from './api';

const classService = {
    getClasses: async () => {
        const response = await api.get('/classes');
        return response.data;
    },
    getClassesByBatch: async (batchId) => {
        const response = await api.get(`/classes/batch/${batchId}`);
        return response.data;
    },
    createClass: async (classData) => {
        const response = await api.post('/classes', classData);
        return response.data;
    }
};

export default classService;
