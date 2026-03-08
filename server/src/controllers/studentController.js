const Student = require('../models/Student');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all students (with pagination, search, filter)
// @route   GET /api/students
// @access  Private/Admin
const getAllStudents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Build query object based on search and filters
  const query = {};

  // Search by fullName, studentId, or phoneNumber
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    query.$or = [
      { fullName: searchRegex },
      { studentId: searchRegex },
      { phoneNumber: searchRegex }
    ];
  }

  // Filter by grade
  if (req.query.grade) {
    query.grade = parseInt(req.query.grade, 10);
  }

  // Count total documents for pagination info
  const total = await Student.countDocuments(query);

  const students = await Student.find(query)
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
  message: 'Students fetched successfully',
  data: students,
  pagination,
});
});

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private/Admin
const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate('user', 'email role _id name createdAt');

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  res.status(200).json({
  success: true,
  message: 'Student fetched successfully',
  data: student,
});
});

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = asyncHandler(async (req, res) => {
  let student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const updatedData = { ...(req.body || {}) };

  // Never allow changing the linked user reference from this route
  delete updatedData.user;

  // Prevent changing immutable/system-managed fields if you want stricter admin control
  // delete updatedData.createdAt;
  // delete updatedData.updatedAt;

  if (updatedData.studentId && updatedData.studentId.trim() !== student.studentId) {
    const studentExists = await Student.findOne({ studentId: updatedData.studentId.trim() });

    if (studentExists && studentExists._id.toString() !== req.params.id) {
      res.status(400);
      throw new Error('Student ID already exists for another student');
    }

    updatedData.studentId = updatedData.studentId.trim();
  }

  if (updatedData.fullName) updatedData.fullName = updatedData.fullName.trim();
  if (updatedData.phoneNumber) updatedData.phoneNumber = updatedData.phoneNumber.trim();
  if (updatedData.parentName) updatedData.parentName = updatedData.parentName.trim();
  if (updatedData.parentContactNumber) updatedData.parentContactNumber = updatedData.parentContactNumber.trim();
  if (updatedData.address) updatedData.address = updatedData.address.trim();

  student = await Student.findByIdAndUpdate(
    req.params.id,
    updatedData,
    { new: true, runValidators: true }
  ).populate('user', 'email role _id name createdAt');

  // Keep linked User name in sync when student fullName changes
  if (updatedData.fullName && student.user?._id) {
    await User.findByIdAndUpdate(student.user._id, { name: updatedData.fullName });
    student = await Student.findById(req.params.id).populate('user', 'email role _id name createdAt');
  }

  res.status(200).json({
    success: true,
    message: 'Student updated successfully',
    data: student,
  });
});

// @desc    Delete a student & linked user
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Get the linked user ID before deleting the student
  const userId = student.user;

  // Delete student profile
  await Student.findByIdAndDelete(req.params.id);

  // Delete linked user account
  if (userId) {
    await User.findByIdAndDelete(userId);
  }

  res.status(200).json({
    success: true,
    message: 'Student profile and linked user account deleted successfully'
  });
});

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};
