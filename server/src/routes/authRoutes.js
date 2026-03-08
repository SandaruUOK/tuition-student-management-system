const express = require('express');
const router = express.Router();

const {
  loginUser,
  getCurrentUser,
  createTeacher,
  createStudent,
} = require('../controllers/authController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);
router.post('/teachers', protect, authorize('admin'), createTeacher);
router.post('/students', protect, authorize('admin'), createStudent);

module.exports = router;