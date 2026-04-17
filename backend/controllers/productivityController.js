const Productivity = require('../models/Productivity');

// @desc    Get productivity stats
// @route   GET /api/productivity
// @access  Private
const getProductivity = async (req, res) => {
    try {
        const stats = await Productivity.find({ userId: req.user.id }).sort('date');
        res.status(200).json({ success: true, count: stats.length, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get today's productivity score
// @route   GET /api/productivity/today
// @access  Private
const getTodayProductivity = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stat = await Productivity.findOne({ userId: req.user.id, date: today });
        res.status(200).json({ success: true, data: stat || { productivityScore: 0, completedTasks: 0, pendingTasks: 0 } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getProductivity, getTodayProductivity };
