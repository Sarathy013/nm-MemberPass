const mongoose = require('mongoose');

const MembershipPlanSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  price:    { type: Number, required: true, min: 0 },
  duration: { type: Number, required: true, min: 1 }, // days
  benefits: [{ type: String }],
  status:   { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('MembershipPlan', MembershipPlanSchema);

