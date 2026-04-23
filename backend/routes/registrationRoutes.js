const express = require('express');
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration
} = require('../controllers/registrationController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // All registration routes require auth

router.post('/:eventId', registerForEvent);
router.get('/my-registrations', getMyRegistrations);
router.delete('/:id', cancelRegistration);

module.exports = router;
