const mongoose = require('mongoose');
const crypto = require('crypto');

const MembershipSchema = new mongoose.Schema({
  memberId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  planId:      { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan', required: true },
  startDate:   { type: Date, required: true },
  expiryDate:  { type: Date, required: true },
  status:      { type: String, enum: ['active', 'expired', 'suspended', 'superseded'], default: 'active' },
  qrTokenHash: { type: String, required: true }, // SHA-256 hash of the raw token
}, { timestamps: true });

// Never store the raw token — only the hash
MembershipSchema.statics.hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = mongoose.model('Membership', MembershipSchema);

