const express = require('express');
const EntryLog = require('../models/EntryLog');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const logs = await EntryLog.find()
      .populate('memberId', 'name memberId')
      .populate('verifiedBy', 'name')
      .sort({ verificationTime: -1 })
      .limit(200);
    res.json(logs);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;

