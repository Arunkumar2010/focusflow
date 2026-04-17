const User = require('../models/User');
const Task = require('../models/Task');
const Productivity = require('../models/Productivity');
const Achievement = require('../models/Achievement');

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const achievements = await Achievement.find({ userId: req.user.id }).sort('unlockedAt');
        
        const userData = user.toObject();
        userData.achievements = achievements;
        
        res.status(200).json({ success: true, data: userData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update user profile & preferences
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.profilePicture !== undefined) user.profilePicture = req.body.profilePicture;
            if (req.body.university !== undefined) user.university = req.body.university;
            if (req.body.department !== undefined) user.department = req.body.department;
            if (req.body.yearOfStudy !== undefined) user.yearOfStudy = req.body.yearOfStudy;
            if (req.body.bio !== undefined) user.bio = req.body.bio;
            
            if (req.body.preferences) {
                const currentPrefs = user.preferences ? (typeof user.preferences.toObject === 'function' ? user.preferences.toObject() : user.preferences) : {};
                user.preferences = {
                    ...currentPrefs,
                    ...req.body.preferences
                };
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.status(200).json({
                success: true,
                data: updatedUser
            });
        } else {
            res.status(404).json({ success: false, error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Reset Productivity Stats
// @route   DELETE /api/users/stats
// @access  Private
const resetStats = async (req, res) => {
    try {
        await Productivity.deleteMany({ user: req.user.id });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete user account and all associated data
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = async (req, res) => {
    try {
        await Task.deleteMany({ user: req.user.id });
        await Productivity.deleteMany({ user: req.user.id });
        await User.findByIdAndDelete(req.user.id);

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get Global Productivity Leaderboard
// @route   GET /api/users/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find().select('name profilePicture university department badges');
        
        // We need to calculate completed tasks for sorting securely or fetch it from a fast aggregation.
        // For simplicity, let's aggregate tasks per user.
        const leaderboard = await Task.aggregate([
            { $match: { status: 'Completed' } },
            { $group: { _id: '$userId', completedTasks: { $sum: 1 } } },
            { $sort: { completedTasks: -1 } },
            { $limit: 10 }
        ]);

        const populatedLeaderboard = leaderboard.map(entry => {
            const userDetails = users.find(u => u._id.toString() === entry._id.toString());
            return {
                _id: entry._id,
                completedTasks: entry.completedTasks,
                user: userDetails || { name: 'Unknown User', profilePicture: '', university: '' }
            };
        });

        res.status(200).json({ success: true, data: populatedLeaderboard });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getMe, updateUserProfile, resetStats, deleteAccount, getLeaderboard };
