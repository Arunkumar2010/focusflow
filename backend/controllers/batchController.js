const Batch = require('../models/Batch');
const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const User = require('../models/User');

// @desc    Get all batches (filtered by role)
// @route   GET /api/batches
// @access  Private
const getBatches = async (req, res) => {
    try {
        let query;
        if (req.user.role === 'teacher') {
            query = { teacher: req.user.id };
        } else if (req.user.role === 'admin') {
            query = {}; 
        } else {
            query = { students: req.user.id };
        }

        const batches = await Batch.find(query).populate('teacher', 'name email').populate('students', 'name email');

        res.status(200).json({
            success: true,
            count: batches.length,
            data: batches
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get teacher specific batches
// @route   GET /api/batches/teacher
// @access  Private (Teacher only)
const getTeacherBatches = async (req, res) => {
    try {
        console.log("Fetching batches for teacher:", req.user.id);
        
        if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }

        const batches = await Batch.find({ teacher: req.user.id })
            .populate('students', 'name email');

        res.status(200).json({
            success: true,
            count: batches.length,
            data: batches
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single batch
// @route   GET /api/batches/:id
// @access  Private
const getBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id)
            .populate('teacher', 'name email')
            .populate('students', 'name email');

        if (!batch) {
            return res.status(404).json({ success: false, error: 'Batch not found' });
        }

        res.status(200).json({
            success: true,
            data: batch
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create new batch
// @route   POST /api/batches
// @access  Private (Teacher only)
const createBatch = async (req, res) => {
    try {
        console.log("Create Batch Request Body:", req.body);
        console.log("Creating batch for user:", req.user.id);

        if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to create batches' });
        }

        const { name, subject } = req.body;
        
        if (!name || !subject) {
            return res.status(400).json({ success: false, error: 'Please provide both name and subject' });
        }

        const batch = await Batch.create({
            name,
            subject,
            teacher: req.user.id
        });

        console.log("Batch Created successfully:", batch._id);

        res.status(201).json({
            success: true,
            data: batch
        });
    } catch (error) {
        console.error("Batch Create Error:", error);
        if(error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        } else {
            res.status(500).json({ success: false, error: 'Server Error' });
        }
    }
};

// @desc    Add student to batch by email
// @route   POST /api/batches/:id/add-student
// @access  Private (Teacher/Admin)
const addStudent = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, error: 'Please provide a student email' });

        const batch = await Batch.findById(req.params.id);
        if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });

        if (batch.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        const User = require('../models/User');
        const student = await User.findOne({ email, role: 'student' });
        if (!student) return res.status(404).json({ success: false, error: 'Student email not found' });

        if (batch.students.includes(student._id)) {
            return res.status(400).json({ success: false, error: 'Student already in batch' });
        }

        batch.students.push(student._id);
        await batch.save();

        const updatedBatch = await Batch.findById(batch._id).populate('students', 'name email');

        res.status(200).json({
            success: true,
            data: updatedBatch
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Remove student from batch
// @route   DELETE /api/batches/:id/remove-student/:studentId
// @access  Private (Teacher/Admin)
const removeStudent = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });

        if (batch.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        batch.students = batch.students.filter(studentId => studentId.toString() !== req.params.studentId);
        await batch.save();

        res.status(200).json({
            success: true,
            data: batch
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get batches for enrolled student
// @route   GET /api/batches/student
// @access  Private (Student only)
const getStudentBatches = async (req, res) => {
    try {
        const batches = await Batch.find({ students: req.user.id })
            .populate('teacher', 'name email')
            .populate('students', 'name email');

        res.status(200).json({
            success: true,
            count: batches.length,
            data: batches
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get teacher analytics
// @route   GET /api/batches/analytics
// @access  Private (Teacher)
const getTeacherAnalytics = async (req, res) => {
    try {
        if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }

        const teacherId = req.user.id;

        // Total Batches
        const batches = await Batch.find({ teacher: teacherId });
        const totalBatches = batches.length;

        // Total Students (unique across all batches)
        const studentIds = new Set();
        batches.forEach(batch => {
            batch.students.forEach(id => studentIds.add(id.toString()));
        });
        const totalStudents = studentIds.size;

        // Upcoming Classes
        const now = new Date();
        const upcomingClasses = await Class.countDocuments({
            teacherId: teacherId,
            datetime: { $gte: now }
        });

        // Total Assignments
        const totalAssignments = await Assignment.countDocuments({
            teacherId: teacherId
        });

        res.status(200).json({
            success: true,
            data: {
                totalBatches,
                totalStudents,
                upcomingClasses,
                totalAssignments
            }
        });
    } catch (error) {
        console.error('getTeacherAnalytics error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

module.exports = {
    getBatches,
    getTeacherBatches,
    getTeacherAnalytics,
    getStudentBatches,
    getBatch,
    createBatch,
    addStudent,
    removeStudent
};
