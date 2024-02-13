const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true
  },
  name: String,
  email: String,
  password: String
});

const Customer = mongoose.model('Customer', customerSchema, 'customer', 'wellquest');

module.exports = Customer;
