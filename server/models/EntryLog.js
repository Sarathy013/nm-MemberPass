const mongoose = require('mongoose');

const EntryLogSchema = new mongoose.Schema({
  memberId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null },
  verificationTime: { type: Date, default: Date.now },
  result:           { type: String, enum: ['granted', 'denied'], required: true },
  reason:           { type: String, required: true },
  verifiedBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: false });

module.exports = mongoose.model('EntryLog', EntryLogSchema);

