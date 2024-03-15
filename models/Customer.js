const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: String,
  email: String,
  password: String,
  coach_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: false
  },
  cust_id: String,
  dailyCalories: Number
});

const Customer = mongoose.model('Customer', customerSchema, 'customer', 'wellquest');

module.exports = Customer;
