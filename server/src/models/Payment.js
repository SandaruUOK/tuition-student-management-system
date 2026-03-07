const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    month: {
      type: String,
      required: [true, 'Please specify the month the payment covers'],
      enum: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    },
    year: {
      type: Number,
      required: [true, 'Please specify the year'],
      default: new Date().getFullYear(),
    },
    amount: {
      type: Number,
      required: [true, 'Please specify the payment amount'],
      min: [0, 'Amount cannot be negative'],
    },
    paymentStatus: {
      type: String,
      required: [true, 'Please specify the payment status'],
      enum: ['Paid', 'Unpaid', 'Partial'],
      default: 'Unpaid',
    },
    paymentDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ student: 1, month: 1, year: 1 }, { unique: true });
paymentSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Payment', paymentSchema);