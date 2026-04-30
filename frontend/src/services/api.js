import axios from 'axios';

// Use the production URL from env, with a fallback to localhost for local development
const baseURL = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : 'http://localhost:5000/api';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enables sending cookies/credentials in cross-origin requests
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Try getting token from 'authToken' or 'user' object in localStorage
        let token = localStorage.getItem('authToken');
        
        if (!token) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && user.token) {
                    token = user.token;
                }
            } catch (error) {
                // Ignore parsing errors
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
