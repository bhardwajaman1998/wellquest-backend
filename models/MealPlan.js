const mongoose = require('mongoose');

const mealTypeSchema = new mongoose.Schema({
  type: String,
  name: String,
  calories: Number,
  recipe: String
});

const mealPlanSchema = new mongoose.Schema({
  cust_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  meals: {
    breakfast: [{ type: mealTypeSchema, required: false }],
    lunch: [{ type: mealTypeSchema, required: false }],
    dinner: [{ type: mealTypeSchema, required: false }]
  }
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema, 'mealPlan', 'wellquest');

module.exports = MealPlan;
