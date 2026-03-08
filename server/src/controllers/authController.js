const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide an email and password');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const responseData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  };

  if (user.role === 'student') {
    const studentProfile = await Student.findOne({ user: user._id });
    if (studentProfile) {
      responseData.studentProfile = studentProfile;
    }
  }

  if (user.role === 'teacher') {
    const teacherProfile = await Teacher.findOne({ user: user._id });
    if (teacherProfile) {
      responseData.teacherProfile = teacherProfile;
    }
  }

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: responseData,
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const responseData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  if (user.role === 'student') {
    const studentProfile = await Student.findOne({ user: user._id });
    if (studentProfile) {
      responseData.studentProfile = studentProfile;
    }
  }

  if (user.role === 'teacher') {
    const teacherProfile = await Teacher.findOne({ user: user._id });
    if (teacherProfile) {
      responseData.teacherProfile = teacherProfile;
    }
  }

  res.status(200).json({
    success: true,
    message: 'Current user fetched successfully',
    data: responseData,
  });
});

// @desc    Create a new teacher account
// @route   POST /api/auth/teachers
// @access  Private/Admin
const createTeacher = asyncHandler(async (req, res) => {
  const { email, password, name, teacherId, subject, phoneNumber, assignedGrades } = req.body;

  if (!email || !password || !name || !teacherId || !subject || !phoneNumber) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const teacherExists = await Teacher.findOne({ teacherId: teacherId.trim() });
  if (teacherExists) {
    res.status(400);
    throw new Error('Teacher ID already exists');
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'teacher',
  });

  try {
    const teacher = await Teacher.create({
      user: user._id,
      teacherId: teacherId.trim(),
      fullName: name.trim(),
      subject: subject.trim(),
      phoneNumber: phoneNumber.trim(),
      assignedGrades: assignedGrades || [],
    });

    res.status(201).json({
      success: true,
      message: 'Teacher account created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        teacherProfile: teacher,
      },
    });
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }
});

// @desc    Create a new student account
// @route   POST /api/auth/students
// @access  Private/Admin
const createStudent = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    name,
    studentId,
    grade,
    phoneNumber,
    parentName,
    parentContactNumber,
    address,
    profilePhoto,
  } = req.body;

  if (
    !email ||
    !password ||
    !name ||
    !studentId ||
    !grade ||
    !phoneNumber ||
    !parentName ||
    !parentContactNumber ||
    !address
  ) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const studentExists = await Student.findOne({ studentId: studentId.trim() });
  if (studentExists) {
    res.status(400);
    throw new Error('Student ID already exists');
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'student',
  });

  try {
    const student = await Student.create({
      user: user._id,
      studentId: studentId.trim(),
      fullName: name.trim(),
      grade,
      phoneNumber: phoneNumber.trim(),
      parentName: parentName.trim(),
      parentContactNumber: parentContactNumber.trim(),
      address: address.trim(),
      profilePhoto: profilePhoto || 'default-profile.png',
    });

    res.status(201).json({
      success: true,
      message: 'Student account created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentProfile: student,
      },
    });
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }
});

module.exports = {
  loginUser,
  getCurrentUser,
  createTeacher,
  createStudent,
};