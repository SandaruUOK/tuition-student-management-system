const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private/Admin
const createClass = asyncHandler(async (req, res) => {
  const { className, grade, subject, teacher, scheduleDay, scheduleTime, duration, location } = req.body;

  if (!className || !grade || !subject || !teacher || !scheduleDay || !scheduleTime || !duration || !location) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Ensure grade is 6, 7, or 8 (Though model validation catches this, checking here is good practice)
  if (![6, 7, 8].includes(parseInt(grade))) {
    res.status(400);
    throw new Error('Grade must be 6, 7, or 8');
  }

  // Validate teacher exists
  const teacherExists = await Teacher.findById(teacher);
  if (!teacherExists) {
    res.status(404);
    throw new Error('Teacher not found');
  }

  const newClass = await Class.create({
    className: className.trim(),
    grade: parseInt(grade),
    subject: subject.trim(),
    teacher,
    scheduleDay,
    scheduleTime,
    duration: parseInt(duration),
    location: location.trim()
  });

  const populatedClass = await Class.findById(newClass._id).populate('teacher', 'fullName teacherId subject');

  res.status(201).json({
    success: true,
    message: 'Class created successfully',
    data: populatedClass
  });
});

// @desc    Get all classes (with pagination, filter)
// @route   GET /api/classes
// @access  Private/Admin
const getAllClasses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Build query object based on filters
  const query = {};

  // Filter by grade
  if (req.query.grade) {
    query.grade = parseInt(req.query.grade, 10);
  }

  // Filter by subject
  if (req.query.subject) {
    query.subject = new RegExp(req.query.subject, 'i');
  }

  // Count total documents for pagination info
  const total = await Class.countDocuments(query);

  const classes = await Class.find(query)
    .populate('teacher', 'fullName teacherId subject phoneNumber')
    .sort({ grade: 1, className: 1 }) 
    .skip(startIndex)
    .limit(limit);

  // Pagination result
  const pagination = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };

  res.status(200).json({
    success: true,
    message: 'Classes fetched successfully',
    data: classes,
    pagination
  });
});

// @desc    Get single class by ID
// @route   GET /api/classes/:id
// @access  Private/Admin
const getClassById = asyncHandler(async (req, res) => {
  const currentClass = await Class.findById(req.params.id)
    .populate('teacher', 'fullName teacherId subject phoneNumber');

  if (!currentClass) {
    res.status(404);
    throw new Error('Class not found');
  }

  res.status(200).json({
    success: true,
    message: 'Class fetched successfully',
    data: currentClass
  });
});

// @desc    Update class details
// @route   PUT /api/classes/:id
// @access  Private/Admin
const updateClass = asyncHandler(async (req, res) => {
  let currentClass = await Class.findById(req.params.id);

  if (!currentClass) {
    res.status(404);
    throw new Error('Class not found');
  }

  // If changing the teacher, validate new teacher exists
  if (req.body.teacher && req.body.teacher !== currentClass.teacher.toString()) {
    const teacherExists = await Teacher.findById(req.body.teacher);
    if (!teacherExists) {
      res.status(404);
      throw new Error('New Teacher not found');
    }
  }

  currentClass = await Class.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('teacher', 'fullName teacherId subject');

  res.status(200).json({
    success: true,
    message: 'Class updated successfully',
    data: currentClass
  });
});

// @desc    Delete a class
// @route   DELETE /api/classes/:id
// @access  Private/Admin
const deleteClass = asyncHandler(async (req, res) => {
  const currentClass = await Class.findById(req.params.id);

  if (!currentClass) {
    res.status(404);
    throw new Error('Class not found');
  }

  await Class.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Class deleted successfully'
  });
});

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass
};
