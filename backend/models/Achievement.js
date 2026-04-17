const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    badgeName: {
        type: String,
        required: true
    },
    badgeIcon: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    unlockedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Achievement', AchievementSchema);
