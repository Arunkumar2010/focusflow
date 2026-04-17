const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a class title'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    datetime: {
        type: Date,
        required: [true, 'Please add a date and time for the class']
    },
    meetingLink: {
        type: String,
        required: [true, 'Please provide a meeting link'],
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please enter a valid URL'
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Class', ClassSchema);
