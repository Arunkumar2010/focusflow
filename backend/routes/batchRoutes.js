const express = require('express');
const { getBatches, getTeacherBatches, getTeacherAnalytics, getStudentBatches, getBatch, createBatch, addStudent, removeStudent } = require('../controllers/batchController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router
    .route('/')
    .get(protect, getTeacherBatches)
    .post(protect, createBatch);

router
    .get('/analytics', protect, getTeacherAnalytics);

router
    .get('/teacher', protect, getTeacherBatches);

router
    .get('/student', protect, getStudentBatches);

router
    .route('/:id')
    .get(protect, getBatch);

router
    .route('/:id/add-student')
    .post(protect, addStudent);

router
    .route('/:id/remove-student/:studentId')
    .delete(protect, removeStudent);

module.exports = router;
