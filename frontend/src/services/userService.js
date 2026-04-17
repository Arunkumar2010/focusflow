import api from './api';

const userService = {
    getProfile: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },
    updateProfile: async (userData) => {
        const response = await api.put('/users/profile', userData);
        
        // Update local storage if name or profile picture changed
        if (response.data.success) {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            if (currentUser && currentUser.user) {
                if (response.data.data.name) currentUser.user.name = response.data.data.name;
                if (response.data.data.profilePicture) currentUser.user.profilePicture = response.data.data.profilePicture;
                if (response.data.data.preferences) currentUser.user.preferences = response.data.data.preferences;
                if (response.data.data.university) currentUser.user.university = response.data.data.university;
                if (response.data.data.bio) currentUser.user.bio = response.data.data.bio;
                localStorage.setItem('user', JSON.stringify(currentUser));
            }
        }
        
        return response.data;
    },
    getLeaderboard: async () => {
        const response = await api.get('/users/leaderboard');
        return response.data;
    },
    resetStats: async () => {
        const response = await api.delete('/users/stats');
        return response.data;
    },
    deleteAccount: async () => {
        const response = await api.delete('/users/account');
        return response.data;
    }
};

export default userService;
