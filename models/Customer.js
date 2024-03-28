const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  coach_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: false
  },
  cust_id: mongoose.Schema.Types.ObjectId,
  dailyCalories: Number
});

const Customer = mongoose.model('Customer', customerSchema, 'customer', 'wellquest');

module.exports = Customer;
