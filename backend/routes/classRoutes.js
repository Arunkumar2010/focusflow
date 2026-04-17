const express = require('express');
const { getClasses, getClassesByBatch, createClass } = require('../controllers/classController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router
    .route('/')
    .get(protect, getClasses)
    .post(protect, createClass);

router
    .route('/batch/:batchId')
    .get(protect, getClassesByBatch);

module.exports = router;
