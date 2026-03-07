const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      required: [true, 'Please provide a unique student ID'],
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    grade: {
      type: Number,
      required: [true, "Please specify the student's grade level"],
      enum: [6, 7, 8],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide a contact phone number'],
      trim: true,
    },
    parentName: {
      type: String,
      required: [true, "Please provide the parent's name"],
      trim: true,
    },
    parentContactNumber: {
      type: String,
      required: [true, "Please provide the parent's contact number"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide a home address'],
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: 'default-profile.png',
      trim: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.index({ studentId: 1 }, { unique: true });
studentSchema.index({ user: 1 }, { unique: true });
studentSchema.index({ grade: 1 });
studentSchema.index({ fullName: 1 });
studentSchema.index({ phoneNumber: 1 });

module.exports = mongoose.model('Student', studentSchema);