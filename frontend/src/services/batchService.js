import api from './api';

const batchService = {
    getBatches: async () => {
        const response = await api.get('/batches');
        return response.data;
    },
    getTeacherBatches: async () => {
        const response = await api.get('/batches/teacher');
        return response.data;
    },
    getStudentBatches: async () => {
        const response = await api.get('/batches/student');
        return response.data;
    },
    getBatch: async (id) => {
        const response = await api.get(`/batches/${id}`);
        return response.data;
    },
    createBatch: async (batchData) => {
        const response = await api.post('/batches', batchData);
        return response.data;
    },
    addStudent: async (batchId, email) => {
        const response = await api.post(`/batches/${batchId}/add-student`, { email });
        return response.data;
    },
    removeStudent: async (batchId, studentId) => {
        const response = await api.delete(`/batches/${batchId}/remove-student/${studentId}`);
        return response.data;
    },
    getTeacherAnalytics: async () => {
        const response = await api.get('/batches/analytics');
        return response.data;
    }
};

export default batchService;
