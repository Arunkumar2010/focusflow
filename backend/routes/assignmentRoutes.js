const express = require('express');
const router = express.Router();
const { createAssignment, getAssignments, submitAssignment } = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAssignments);
router.post('/', authorize('teacher', 'admin'), createAssignment);
router.post('/:id/submit', authorize('student'), submitAssignment);

module.exports = router;
