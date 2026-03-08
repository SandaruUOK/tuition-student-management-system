const express = require('express');
const router = express.Router();

const {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');

const { protect, authorize } = require('../middleware/authMiddleware');

// All student routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(getAllStudents);

router
  .route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;
