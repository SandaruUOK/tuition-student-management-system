const express = require('express');
const router = express.Router();

const {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass
} = require('../controllers/classController');

const { protect, authorize } = require('../middleware/authMiddleware');

// All class routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .post(createClass)
  .get(getAllClasses);

router
  .route('/:id')
  .get(getClassById)
  .put(updateClass)
  .delete(deleteClass);

module.exports = router;
