const Assignment = require('../models/Assignment');
const Batch = require('../models/Batch');

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Private (Teacher)
const createAssignment = async (req, res) => {
    try {
        const { title, description, batchId, dueDate } = req.body;

        if (!title || !batchId || !dueDate) {
            return res.status(400).json({ success: false, message: 'Please provide title, batchId and dueDate' });
        }

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        const assignment = await Assignment.create({
            title,
            description,
            batchId,
            teacherId: req.user.id,
            dueDate
        });

        res.status(201).json({
            success: true,
            data: assignment
        });
    } catch (error) {
        console.error('createAssignment error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get assignments
// @route   GET /api/assignments
// @access  Private
const getAssignments = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'teacher') {
            query = { teacherId: req.user.id };
        } else {
            // Find batches student is in
            const batches = await Batch.find({ students: req.user.id }).select('_id');
            const batchIds = batches.map(b => b._id);
            query = { batchId: { $in: batchIds } };
        }

        const assignments = await Assignment.find(query)
            .populate('batchId', 'name subject')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: assignments.length,
            data: assignments
        });
    } catch (error) {
        console.error('getAssignments error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Submit assignment work
// @route   POST /api/assignments/:id/submit
// @access  Private (Student)
const submitAssignment = async (req, res) => {
    try {
        const { content } = req.body;
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        // Check if student already submitted
        const alreadySubmitted = assignment.submissions.find(
            s => s.studentId.toString() === req.user.id
        );

        if (alreadySubmitted) {
            alreadySubmitted.content = content;
            alreadySubmitted.submittedAt = Date.now();
        } else {
            assignment.submissions.push({
                studentId: req.user.id,
                content
            });
        }

        await assignment.save();

        res.status(200).json({
            success: true,
            data: assignment
        });
    } catch (error) {
        console.error('submitAssignment error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    createAssignment,
    getAssignments,
    submitAssignment
};
