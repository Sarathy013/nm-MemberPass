const express = require('express');
const { body, validationResult } = require('express-validator');
const Member = require('../models/Member');
const auth = require('../middleware/auth');
const router = express.Router();

function nextMemberId(last) {
  const num = last ? parseInt(last.memberId.replace('MP-', '')) + 1 : 1;
  return `MP-${String(num).padStart(5, '0')}`;
}

// GET all members
router.get('/', auth, async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// GET single member
router.get('/:id', auth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// POST create member
router.post('/',
  auth,
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('phone').trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const last = await Member.findOne().sort({ createdAt: -1 });
      const memberId = nextMemberId(last);
      const member = await Member.create({ ...req.body, memberId });
      res.status(201).json(member);
    } catch (err) {
      if (err.code === 11000) return res.status(409).json({ message: 'Email already exists' });
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// PUT update member
router.put('/:id', auth, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// DELETE member
router.delete('/:id', auth, async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member deleted' });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;

