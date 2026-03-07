const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    teacherId: {
      type: String,
      required: [true, 'Please provide a unique teacher ID'],
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please specify the primary teaching subject'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide a contact phone number'],
      trim: true,
    },
    assignedGrades: [
      {
        type: Number,
        enum: [6, 7, 8],
      },
    ],
  },
  {
    timestamps: true,
  }
);

teacherSchema.index({ teacherId: 1 }, { unique: true });
teacherSchema.index({ user: 1 }, { unique: true });
teacherSchema.index({ assignedGrades: 1 });

module.exports = mongoose.model('Teacher', teacherSchema);