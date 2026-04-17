import api from './api';

const assignmentService = {
    getAssignments: async () => {
        const response = await api.get('/assignments');
        return response.data;
    },
    createAssignment: async (assignmentData) => {
        const response = await api.post('/assignments', assignmentData);
        return response.data;
    },
    submitAssignment: async (id, content) => {
        const response = await api.post(`/assignments/${id}/submit`, { content });
        return response.data;
    }
};

export default assignmentService;
