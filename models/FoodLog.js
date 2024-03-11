const mongoose = require('mongoose');

const foodLogSchema = new mongoose.Schema({
    cust_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    name: String,
    serving_size: String,
    timeStamp: Date,
    meal_type: String,
    info: {
      calories: Number,
      carbs: Number,
      fats: Number,
      proteins: Number
    }
  });
  
const FoodLog = mongoose.model('FoodLog', foodLogSchema, 'foodLog', 'wellquest');

module.exports = FoodLog;