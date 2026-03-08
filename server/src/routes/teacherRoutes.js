const express = require('express');
const router = express.Router();

const {
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');

const { protect, authorize } = require('../middleware/authMiddleware');

// All teacher routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(getAllTeachers);

router
  .route('/:id')
  .get(getTeacherById)
  .put(updateTeacher)
  .delete(deleteTeacher);

module.exports = router;
