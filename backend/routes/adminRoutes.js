const express = require('express');
const { getStats, getEventRegistrations } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/events/:eventId/registrations', getEventRegistrations);

module.exports = router;
