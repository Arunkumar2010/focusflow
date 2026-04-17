const express = require('express');
const { getProductivity, getTodayProductivity } = require('../controllers/productivityController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getProductivity);
router.route('/today').get(getTodayProductivity);

module.exports = router;
