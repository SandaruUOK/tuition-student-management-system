const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Please specify the exam subject'],
      trim: true,
    },
    examName: {
      type: String,
      required: [true, 'Please specify the name of the exam'],
      trim: true,
    },
    marks: {
      type: Number,
      required: [true, 'Please specify the marks obtained'],
      min: [0, 'Marks cannot be negative'],
    },
    maxMarks: {
      type: Number,
      required: [true, 'Please specify maximum allowed marks for the exam'],
      default: 100,
      min: [1, 'Maximum marks must be at least 1'],
    },
    grade: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

marksSchema.index({ student: 1 });
marksSchema.index({ subject: 1 });
marksSchema.index({ student: 1, subject: 1 });

module.exports = mongoose.model('Marks', marksSchema);