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

const MealType = mongoose.model('MealType', mealTypeSchema, 'mealType', 'wellquest');

module.exports = MealType;