const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
    cust_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    cal_goal: Number,
    weight_goal: Number,
    water: Number
  });
  
const Milestone = mongoose.model('Milestone', milestoneSchema, 'milestone', 'wellquest');

module.exports = Milestone;