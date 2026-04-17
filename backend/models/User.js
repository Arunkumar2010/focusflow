const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    profilePicture: {
        type: String,
        default: ''
    },
    university: {
        type: String,
        default: ''
    },
    department: {
        type: String,
        default: ''
    },
    yearOfStudy: {
        type: String,
        default: ''
    },
    badges: {
        type: [String],
        default: []
    },
    bio: {
        type: String,
        default: ''
    },
    level: {
        type: Number,
        default: 1
    },
    experiencePoints: {
        type: Number,
        default: 0
    },
    preferences: {
        theme: { type: String, default: 'dark' },
        accentColor: { type: String, default: '#3b82f6' },
        layout: { type: String, default: 'grid' },
        enableAnimations: { type: Boolean, default: true },
        notifications: {
            email: { type: Boolean, default: true },
            deadlines: { type: Boolean, default: true },
            reports: { type: Boolean, default: false },
            studySessions: { type: Boolean, default: true }
        },
        pomodoroDuration: { type: Number, default: 25 },
        breakDuration: { type: Number, default: 5 },
        dailyGoal: { type: Number, default: 5 },
        weeklyTarget: { type: Number, default: 30 }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
