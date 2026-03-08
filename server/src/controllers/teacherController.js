const Teacher = require('../models/Teacher');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all teachers (with pagination, search)
// @route   GET /api/teachers
// @access  Private/Admin
const getAllTeachers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Build query object based on search
  const query = {};

  // Search by fullName, teacherId, subject, or phoneNumber
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    query.$or = [
      { fullName: searchRegex },
      { teacherId: searchRegex },
      { subject: searchRegex },
      { phoneNumber: searchRegex }
    ];
  }

  // Count total documents for pagination info
  const total = await Teacher.countDocuments(query);

  const teachers = await Teacher.find(query)
    .populate('user', 'email role _id name createdAt')
    .sort({ createdAt: -1 }) // Newest first
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
    message: 'Teachers fetched successfully',
    data: teachers,
    pagination
  });
});

// @desc    Get single teacher by ID
// @route   GET /api/teachers/:id
// @access  Private/Admin
const getTeacherById = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id)
    .populate('user', 'email role _id name createdAt');

  if (!teacher) {
    res.status(404);
    throw new Error('Teacher not found');
  }

  res.status(200).json({
    success: true,
    message: 'Teacher fetched successfully',
    data: teacher
  });
});

// @desc    Update teacher details
// @route   PUT /api/teachers/:id
// @access  Private/Admin
const updateTeacher = asyncHandler(async (req, res) => {
  let teacher = await Teacher.findById(req.params.id);

  if (!teacher) {
    res.status(404);
    throw new Error('Teacher not found');
  }

  const updatedData = { ...(req.body || {}) };

  // Never allow changing the linked user reference from this route
  delete updatedData.user;

  // If trying to change the teacherId, check if the new teacherId already exists
  if (updatedData.teacherId && updatedData.teacherId.trim() !== teacher.teacherId) {
    const teacherExists = await Teacher.findOne({ teacherId: updatedData.teacherId.trim() });
    
    if (teacherExists && teacherExists._id.toString() !== req.params.id) {
      res.status(400);
      throw new Error('Teacher ID already exists for another teacher');
    }
    updatedData.teacherId = updatedData.teacherId.trim();
  }

  if (updatedData.fullName) updatedData.fullName = updatedData.fullName.trim();
  if (updatedData.subject) updatedData.subject = updatedData.subject.trim();
  if (updatedData.phoneNumber) updatedData.phoneNumber = updatedData.phoneNumber.trim();

  teacher = await Teacher.findByIdAndUpdate(
    req.params.id,
    updatedData,
    { new: true, runValidators: true }
  ).populate('user', 'email role _id name createdAt');

  // Keep linked User name in sync when teacher fullName changes
  if (updatedData.fullName && teacher.user?._id) {
    await User.findByIdAndUpdate(teacher.user._id, { name: updatedData.fullName });
    teacher = await Teacher.findById(req.params.id).populate('user', 'email role _id name createdAt');
  }

  res.status(200).json({
    success: true,
    message: 'Teacher updated successfully',
    data: teacher
  });
});

// @desc    Delete a teacher & linked user
// @route   DELETE /api/teachers/:id
// @access  Private/Admin
const deleteTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);

  if (!teacher) {
    res.status(404);
    throw new Error('Teacher not found');
  }

  // Get the linked user ID before deleting the teacher
  const userId = teacher.user;

  // Delete teacher profile
  await Teacher.findByIdAndDelete(req.params.id);

  // Delete linked user account
  if (userId) {
    await User.findByIdAndDelete(userId);
  }

  res.status(200).json({
    success: true,
    message: 'Teacher profile and linked user account deleted successfully'
  });
});

module.exports = {
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
};
