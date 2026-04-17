const Class = require('../models/Class');
const Batch = require('../models/Batch');

// Helper to determine status dynamically
const calculateStatus = (datetime) => {
    try {
        const now = new Date();
        const classDate = new Date(datetime);
        const oneHourLater = new Date(classDate.getTime() + 60 * 60 * 1000);

        if (now < classDate) return 'Upcoming';
        if (now >= classDate && now <= oneHourLater) return 'Ongoing';
        return 'Completed';
    } catch (err) {
        return 'Upcoming'; // Fallback
    }
};

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private
const getClasses = async (req, res) => {
    try {
        let query;

        if (req.user.role === 'teacher') {
            query = { teacherId: req.user.id };
        } else if (req.user.role === 'admin') {
            query = {}; 
        } else {
            const studentBatches = await Batch.find({ students: req.user.id }).select('_id');
            const batchIds = studentBatches.map(b => b._id);
            query = { batchId: { $in: batchIds } };
        }

        const classes = await Class.find(query)
            .populate('teacherId', 'name email')
            .populate('batchId', 'name subject')
            .sort({ datetime: 1 });

        // Inject dynamic status
        const classesWithStatus = classes.map(cls => {
            const clsObj = cls.toObject();
            clsObj.status = calculateStatus(cls.datetime);
            return clsObj;
        });

        res.status(200).json({
            success: true,
            count: classesWithStatus.length,
            data: classesWithStatus
        });
    } catch (error) {
        console.error('getClasses error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get classes by batch ID
// @route   GET /api/classes/batch/:batchId
// @access  Private
const getClassesByBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.batchId);
        
        if (!batch) {
             return res.status(404).json({ success: false, error: 'Batch not found' });
        }

        if (req.user.role === 'student') {
            const isStudentInBatch = batch.students.some(id => id.toString() === req.user.id.toString());
            if (!isStudentInBatch) {
                return res.status(403).json({ success: false, error: 'Not authorized to view these classes' });
            }
        } else if (req.user.role === 'teacher') {
            if (batch.teacherId.toString() !== req.user.id.toString()) {
                 return res.status(403).json({ success: false, error: 'Not authorized to view these classes' });
            }
        }

        const classes = await Class.find({ batchId: req.params.batchId })
            .populate('teacherId', 'name')
            .sort({ datetime: 1 });

        const classesWithStatus = classes.map(cls => {
            const clsObj = cls.toObject();
            clsObj.status = calculateStatus(cls.datetime);
            return clsObj;
        });

        res.status(200).json({
            success: true,
            count: classesWithStatus.length,
            data: classesWithStatus
        });
    } catch (error) {
        console.error('getClassesByBatch error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create new class
// @route   POST /api/classes
// @access  Private (Teacher only)
const createClass = async (req, res) => {
    try {
        console.log("Schedule Class API Request Payload:", req.body);

        const { title, description, batchId, datetime, meetingLink } = req.body;

        if (!title || !batchId || !datetime || !meetingLink) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        const batchExists = await Batch.findById(batchId);
        if (!batchExists) {
            return res.status(404).json({ success: false, message: "Batch not found" });
        }

        const newClass = await Class.create({
            title,
            description,
            batchId,
            teacherId: req.user.id,
            datetime,
            meetingLink
        });

        res.status(200).json({
            success: true,
            data: newClass
        });

    } catch (error) {
        console.error('createClass error:', error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    getClasses,
    getClassesByBatch,
    createClass
};
