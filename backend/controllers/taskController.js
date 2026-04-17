const Task = require('../models/Task');
const Productivity = require('../models/Productivity');
const { validateTask } = require('../validations/taskValidation');

// Helper to update Productivity
const updateProductivityScore = async (userId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedCount = await Task.countDocuments({ userId, status: 'Completed', createdAt: { $gte: today } });
    const pendingCount = await Task.countDocuments({ userId, status: { $ne: 'Completed' }, createdAt: { $gte: today } });
    
    let score = 0;
    const total = completedCount + pendingCount;
    if (total > 0) {
        score = Math.round((completedCount / total) * 100);
    }

    await Productivity.findOneAndUpdate(
        { userId, date: today },
        { completedTasks: completedCount, pendingTasks: pendingCount, productivityScore: score },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
};

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort('-createdAt');
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    try {
        const { errors, isValid } = validateTask(req.body);
        if (!isValid) return res.status(400).json({ success: false, errors });

        req.body.userId = req.user.id;
        const task = await Task.create(req.body);
        
        await updateProductivityScore(req.user.id);

        res.status(201).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const BADGE_RULES = {
    1: { name: 'Starter Badge', icon: '/badges/starter.svg', description: 'You completed your first task!' },
    5: { name: 'Productivity Beginner', icon: '/badges/beginner.svg', description: 'You completed 5 tasks. Great start!' },
    10: { name: 'Focus Master', icon: '/badges/focusmaster.svg', description: 'You completed 10 tasks. Keep going!' },
    25: { name: 'Task Champion', icon: '/badges/champion.svg', description: 'You completed 25 tasks. You are a champion!' },
    50: { name: 'Productivity Legend', icon: '/badges/legend.svg', description: 'You completed 50 tasks. Truly legendary!' }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
        if (task.userId.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized' });

        const previousStatus = task.status;
        const newStatus = req.body.status || task.status;

        if (newStatus === 'Completed' && previousStatus !== 'Completed') {
            req.body.completedAt = new Date();
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        
        await updateProductivityScore(req.user.id);

        let unlockedBadges = [];
        let levelUp = false;
        if (newStatus === 'Completed' && previousStatus !== 'Completed') {
            const completedCount = await Task.countDocuments({ userId: req.user.id, status: 'Completed' });
            
            const User = require('../models/User');
            const Achievement = require('../models/Achievement');
            const user = await User.findById(req.user.id);
            
            // Experience and Leveling logic
            let currentExp = user.experiencePoints || 0;
            let currentLevel = user.level || 1;
            
            currentExp += 20; // 20 EXP per completed task
            let expNeeded = currentLevel * 100; 
            
            if (currentExp >= expNeeded) {
                currentLevel += 1;
                currentExp -= expNeeded;
                levelUp = true;
            }
            
            user.experiencePoints = currentExp;
            user.level = currentLevel;
            
            // Badges
            const badgeKey = Object.keys(BADGE_RULES).find(key => parseInt(key) === completedCount);
            const newBadgeData = BADGE_RULES[badgeKey];
            
            if (newBadgeData && (!user.badges || !user.badges.includes(newBadgeData.name))) {
                if(!user.badges) user.badges = [];
                user.badges.push(newBadgeData.name);
                
                const achievement = await Achievement.create({
                    userId: req.user.id,
                    badgeName: newBadgeData.name,
                    badgeIcon: newBadgeData.icon,
                    description: newBadgeData.description
                });
                
                unlockedBadges.push(achievement);
            }
            await user.save();
        }

        res.status(200).json({ success: true, data: task, unlockedBadges, levelUp });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
        if (task.userId.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized' });

        await task.deleteOne(); // Mongoose 6+ instead of remove()
        
        await updateProductivityScore(req.user.id);

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
         res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
