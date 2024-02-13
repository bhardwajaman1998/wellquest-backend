const mongoose = require('mongoose');

const foodLogSchema = new mongoose.Schema({
    cust_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    name: String,
    serving_size: String,
    num_of_serving: Number,
    timeStamp: Date,
    meal_type: String
  });
  
const FoodLog = mongoose.model('FoodLog', foodLogSchema, 'foodLog', 'wellquest');

module.exports = FoodLog;