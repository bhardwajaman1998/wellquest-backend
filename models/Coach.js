const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
    name: String,
    email: String,
    num_of_clients: Number,
    exp: Number,
    completed_goals: Number,
    gyms: [String],
    description_array: [String],
    booked_slot: [Date]
});
  
const Coach = mongoose.model('Coach', coachSchema, 'coach', 'wellquest');

module.exports = Coach;