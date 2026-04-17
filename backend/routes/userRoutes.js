const express = require('express');
const { getMe, updateUserProfile, resetStats, deleteAccount, getLeaderboard } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/leaderboard').get(getLeaderboard);
router.route('/me').get(getMe);
router.route('/profile').get(getMe).put(updateUserProfile);
router.route('/stats').delete(resetStats);
router.route('/account').delete(deleteAccount);

module.exports = router;
