const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:        { type: String, required: true },
  memberId:     { type: String, required: true, unique: true },
  profileImage: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Member', MemberSchema);

