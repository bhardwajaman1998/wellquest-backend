const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    date: Date,
    coach_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coach',
      required: true
    },
    coach_name: String,
    cust_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    cancelled: {
      type: Boolean,
      default: false
    },
    timeSlot:String,
  });
  
const Appointment = mongoose.model('Appointment', appointmentSchema, 'appointment', 'wellquest');

module.exports = Appointment;