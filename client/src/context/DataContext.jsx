import { createContext, useContext, useState } from 'react';
import {
  DEMO_MEMBERS, DEMO_MEMBERSHIPS, DEMO_PLANS, DEMO_ENTRY_LOGS
} from '../data/demoData';

const DataContext = createContext(null);

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function generateMemberId(members) {
  const max = members.reduce((acc, m) => {
    const num = parseInt(m.memberId?.replace('MP-', '') || '0');
    return Math.max(acc, num);
  }, 0);
  return `MP-${String(max + 1).padStart(5, '0')}`;
}

function generateQrToken(memberId) {
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `${memberId}-QR-${random}`;
}

export function DataProvider({ children }) {
  const [members, setMembers]       = useState([...DEMO_MEMBERS]);
  const [memberships, setMemberships] = useState([...DEMO_MEMBERSHIPS]);
  const [plans, setPlans]           = useState([...DEMO_PLANS]);
  const [entryLogs, setEntryLogs]   = useState([...DEMO_ENTRY_LOGS]);

  // ── Members ──────────────────────────────────────────────
  const addMember = (data) => {
    const newMember = {
      id: generateId('m'),
      ...data,
      memberId: generateMemberId(members),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMembers(prev => [newMember, ...prev]);
    return newMember;
  };

  const updateMember = (id, data) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  };

  const deleteMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    setMemberships(prev => prev.filter(ms => ms.memberId !== id));
  };

  const getMemberById = (id) => members.find(m => m.id === id);

  // ── Memberships ───────────────────────────────────────────
  const assignMembership = (memberId, planId) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return null;
    const member = members.find(m => m.id === memberId);
    if (!member) return null;

    const start = new Date();
    const expiry = new Date(start);
    expiry.setDate(expiry.getDate() + plan.duration);

    const qrToken = generateQrToken(member.memberId);

    // Deactivate old memberships for this member
    setMemberships(prev => prev.map(ms =>
      ms.memberId === memberId ? { ...ms, status: 'superseded' } : ms
    ));

    const newMs = {
      id: generateId('ms'),
      memberId,
      planId,
      startDate: start.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      status: 'active',
      qrToken,
    };
    setMemberships(prev => [newMs, ...prev]);
    return newMs;
  };

  const getMembershipByMemberId = (memberId) => {
    return memberships
      .filter(ms => ms.memberId === memberId && ms.status !== 'superseded')
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];
  };

  const updateMembershipStatus = (id, status) => {
    setMemberships(prev => prev.map(ms => ms.id === id ? { ...ms, status } : ms));
  };

  // ── Plans ─────────────────────────────────────────────────
  const addPlan = (data) => {
    const newPlan = { id: generateId('plan'), ...data, createdAt: new Date().toISOString().split('T')[0] };
    setPlans(prev => [newPlan, ...prev]);
    return newPlan;
  };

  const updatePlan = (id, data) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const togglePlanStatus = (id) => {
    setPlans(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    ));
  };

  // ── Verification ──────────────────────────────────────────
  /**
   * Verify a QR token (demo mode — backend makes real decision in production).
   * ⚠️ DEMO MODE: verification logic runs client-side. In production the
   * backend must make the final access decision; never trust frontend status.
   */
  const verifyQrToken = (token, verifiedBy = 'Staff') => {
    const membership = memberships.find(ms => ms.qrToken === token);

    if (!membership) {
      const log = {
        id: generateId('el'), memberId: null, memberName: 'Unknown',
        verificationTime: new Date().toISOString(),
        result: 'denied', reason: 'Invalid QR code', verifiedBy,
      };
      setEntryLogs(prev => [log, ...prev]);
      return { result: 'denied', reason: 'Invalid QR code', member: null };
    }

    const member = getMemberById(membership.memberId);
    const plan = plans.find(p => p.id === membership.planId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(membership.expiryDate);

    let result = 'denied';
    let reason = '';

    if (membership.status === 'suspended') {
      reason = 'Membership suspended';
    } else if (membership.status === 'expired' || expiry < today) {
      reason = 'Membership expired';
      // Auto-update status
      setMemberships(prev => prev.map(ms =>
        ms.id === membership.id ? { ...ms, status: 'expired' } : ms
      ));
    } else if (membership.status === 'active') {
      result = 'granted';
      reason = 'Active membership';
    } else {
      reason = 'Membership not active';
    }

    const log = {
      id: generateId('el'),
      memberId: member?.id || null,
      memberName: member?.name || 'Unknown',
      verificationTime: new Date().toISOString(),
      result, reason, verifiedBy,
    };
    setEntryLogs(prev => [log, ...prev]);

    return { result, reason, member, plan, membership };
  };

  // ── Stats ─────────────────────────────────────────────────
  const getStats = () => {
    const activeMemberships = memberships.filter(ms => ms.status === 'active');
    const expiredMemberships = memberships.filter(ms => ms.status === 'expired');
    const suspendedMemberships = memberships.filter(ms => ms.status === 'suspended');
    const revenue = activeMemberships.reduce((sum, ms) => {
      const plan = plans.find(p => p.id === ms.planId);
      return sum + (plan?.price || 0);
    }, 0);

    return {
      totalMembers: members.length,
      activeMembers: activeMemberships.length,
      expiredMembers: expiredMemberships.length,
      suspendedMembers: suspendedMemberships.length,
      totalRevenue: revenue,
      recentMembers: [...members].slice(0, 5),
      recentLogs: [...entryLogs].slice(0, 10),
    };
  };

  return (
    <DataContext.Provider value={{
      members, memberships, plans, entryLogs,
      addMember, updateMember, deleteMember, getMemberById,
      assignMembership, getMembershipByMemberId, updateMembershipStatus,
      addPlan, updatePlan, togglePlanStatus,
      verifyQrToken, getStats,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
