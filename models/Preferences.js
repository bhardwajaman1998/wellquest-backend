const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
    cust_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    gender: String,
    age: Number,
    height: Number,
    weight: Number,
    goal: String,
    activityLevel: String
});
  
const Preference = mongoose.model('Preference', preferencesSchema, 'preference', 'wellquest');

module.exports = Preference;