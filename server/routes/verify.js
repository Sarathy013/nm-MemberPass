const express = require('express');
const crypto = require('crypto');
const Membership = require('../models/Membership');
const Member = require('../models/Member');
const MembershipPlan = require('../models/MembershipPlan');
const EntryLog = require('../models/EntryLog');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * POST /api/verify
 * Body: { qrToken: string }
 *
 * Security rules:
 *  1. Only the backend computes the access decision.
 *  2. Status is never trusted from the frontend.
 *  3. Both successful and unsuccessful scans are logged.
 *  4. Expired memberships are updated automatically.
 */
router.post('/', auth, async (req, res) => {
  const { qrToken } = req.body;
  if (!qrToken) return res.status(400).json({ result: 'denied', reason: 'No QR token provided' });

  const tokenHash = crypto.createHash('sha256').update(qrToken).digest('hex');

  try {
    const membership = await Membership.findOne({ qrTokenHash: tokenHash }).populate('planId');

    // Invalid token
    if (!membership) {
      await EntryLog.create({
        memberId: null, result: 'denied', reason: 'Invalid QR code', verifiedBy: req.user._id,
      });
      return res.json({ result: 'denied', reason: 'Invalid QR code' });
    }

    const member = await Member.findById(membership.memberId);
    const today  = new Date(); today.setHours(0, 0, 0, 0);
    const expiry = new Date(membership.expiryDate);

    let result = 'denied';
    let reason = '';

    if (membership.status === 'suspended') {
      reason = 'Membership suspended';
    } else if (membership.status === 'superseded') {
      reason = 'QR code has been superseded';
    } else if (membership.status === 'expired' || expiry < today) {
      reason = 'Membership expired';
      // Auto-update expired status
      if (membership.status !== 'expired') {
        await Membership.findByIdAndUpdate(membership._id, { status: 'expired' });
      }
    } else if (membership.status === 'active') {
      result = 'granted';
      reason = 'Active membership';
    } else {
      reason = 'Membership not active';
    }

    await EntryLog.create({
      memberId: member?._id || null,
      result, reason,
      verifiedBy: req.user._id,
    });

    res.json({
      result, reason,
      member: member ? { name: member.name, memberId: member.memberId, email: member.email } : null,
      plan: membership.planId ? { name: membership.planId.name } : null,
      expiryDate: membership.expiryDate,
    });
  } catch (err) {
    res.status(500).json({ result: 'denied', reason: 'Server error' });
  }
});

module.exports = router;

