const mongoose = require('mongoose');

const ProductivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    completedTasks: {
        type: Number,
        default: 0
    },
    pendingTasks: {
        type: Number,
        default: 0
    },
    productivityScore: {
        type: Number,
        default: 0
    }
});

// Create a compound index so a user only has one productivity record per date map (ignoring time)
ProductivitySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Productivity', ProductivitySchema);
