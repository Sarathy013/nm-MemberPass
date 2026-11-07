const express = require('express');
const crypto = require('crypto');
const Membership = require('../models/Membership');
const Member = require('../models/Member');
const MembershipPlan = require('../models/MembershipPlan');
const auth = require('../middleware/auth');
const router = express.Router();

// GET memberships for a member
router.get('/member/:memberId', auth, async (req, res) => {
  try {
    const ms = await Membership.find({ memberId: req.params.memberId })
      .populate('planId').sort({ createdAt: -1 });
    res.json(ms);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// POST assign plan → generates QR token hash
router.post('/assign', auth, async (req, res) => {
  const { memberId, planId } = req.body;
  if (!memberId || !planId) return res.status(400).json({ message: 'memberId and planId required' });

  try {
    const [member, plan] = await Promise.all([
      Member.findById(memberId),
      MembershipPlan.findById(planId),
    ]);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    if (!plan || plan.status !== 'active') return res.status(400).json({ message: 'Plan not active' });

    // Supersede existing active memberships
    await Membership.updateMany({ memberId, status: 'active' }, { status: 'superseded' });

    const startDate  = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + plan.duration);

    // Generate a secure random token (never stored raw; frontend gets it once)
    const rawToken    = `${member.memberId}-${crypto.randomBytes(24).toString('hex')}`;
    const qrTokenHash = Membership.hashToken(rawToken);

    const ms = await Membership.create({
      memberId, planId, startDate, expiryDate, status: 'active', qrTokenHash,
    });

    // Return rawToken once — client embeds it in the QR code
    res.status(201).json({ membership: ms, qrToken: rawToken });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// PATCH update status (suspend/reactivate)
router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  if (!['active', 'suspended', 'expired'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  try {
    const ms = await Membership.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!ms) return res.status(404).json({ message: 'Membership not found' });
    res.json(ms);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;

