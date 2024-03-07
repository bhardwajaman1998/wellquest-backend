const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
    name: String,
    bio:String,
    email: String,
    num_of_clients: Number,
    exp: Number,
    completed_goals: Number,
    gyms: [String],
    description_array: [[String]],
    booked_slot: [Date],
    available_slots: [[String]]
});
  
const Coach = mongoose.model('Coach', coachSchema, 'coach', 'wellquest');

module.exports = Coach;