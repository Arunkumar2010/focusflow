import api from './api';

const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        return response.data;
    },
    login: async (userData) => {
        const response = await api.post('/auth/login', userData);
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
    },
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },
    setAuthHeaders: () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        }
    }
};

export default authService;
