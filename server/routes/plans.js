const express = require('express');
const { body, validationResult } = require('express-validator');
const MembershipPlan = require('../models/MembershipPlan');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try { res.json(await MembershipPlan.find().sort({ createdAt: -1 })); }
  catch { res.status(500).json({ message: 'Server error' }); }
});

router.post('/',
  auth, role('admin'),
  body('name').trim().notEmpty(),
  body('price').isNumeric({ min: 0 }),
  body('duration').isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try { res.status(201).json(await MembershipPlan.create(req.body)); }
    catch { res.status(500).json({ message: 'Server error' }); }
  }
);

router.put('/:id', auth, role('admin'), async (req, res) => {
  try {
    const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.patch('/:id/toggle', auth, role('admin'), async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    plan.status = plan.status === 'active' ? 'inactive' : 'active';
    await plan.save();
    res.json(plan);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;

