const mongoose = require('mongoose');

const mealTypeSchema = new mongoose.Schema({
  cust_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  type: String,
  short_name: String,
  full_name: String,
  total_cal: Number,
  recipe: String
});

const mealPlanSchema = new mongoose.Schema({
  cust_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  meals: {
    breakfast: { type: mealTypeSchema, required: true },
    lunch: { type: mealTypeSchema, required: true },
    dinner: { type: mealTypeSchema, required: true }
  }
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema, 'mealPlan', 'wellquest');

module.exports = MealPlan;
