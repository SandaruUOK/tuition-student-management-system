const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please specify the date of the class'],
      default: Date.now,
    },
    status: {
      type: String,
      required: [true, 'Please specify the attendance status'],
      enum: ['Present', 'Absent'],
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ student: 1, class: 1, date: 1 }, { unique: true });
attendanceSchema.index({ class: 1 });
attendanceSchema.index({ date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);