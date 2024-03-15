const mongoose = require("mongoose");

const preferencesSchema = new mongoose.Schema({
  cust_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  gender: String,
  age: Number,
  height: String,
  weight: String,
  goal: String,
  activityLevel: String,
  minimumCalories: Number,
});

const Preference = mongoose.model(
  "Preference",
  preferencesSchema,
  "preference",
  "wellquest"
);

module.exports = Preference;
