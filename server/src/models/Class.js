const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: [true, 'Please provide a class name'],
      trim: true,
    },
    grade: {
      type: Number,
      required: [true, 'Please specify the class grade'],
      enum: [6, 7, 8],
    },
    subject: {
      type: String,
      required: [true, 'Please specify the class subject'],
      trim: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    scheduleDay: {
      type: String,
      required: [true, 'Please specify the day of the week'],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    scheduleTime: {
      type: String,
      required: [true, 'Please specify the start schedule time'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please use HH:MM 24-hour format'],
    },
    duration: {
      type: Number,
      required: [true, 'Please provide the duration in minutes'],
      min: [30, 'Duration must be at least 30 minutes'],
    },
    location: {
      type: String,
      required: [true, 'Please provide the class location or online link'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

classSchema.index({ teacher: 1 });
classSchema.index({ grade: 1, subject: 1 });
classSchema.index({ scheduleDay: 1, scheduleTime: 1 });

module.exports = mongoose.model('Class', classSchema);