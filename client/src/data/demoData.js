// Demo data for MemberPass - used when backend is unavailable
// ⚠️ DEMO MODE: This is sample data only. Not production-secure.

export const DEMO_USERS = [
  { id: 'u1', name: 'Admin User', email: 'admin@memberpass.demo', password: 'admin123', role: 'admin' },
  { id: 'u2', name: 'Staff Member', email: 'staff@memberpass.demo', password: 'staff123', role: 'staff' },
];

export const DEMO_PLANS = [
  {
    id: 'plan1', name: 'Basic Monthly', price: 1500, duration: 30, durationType: 'days',
    benefits: ['Gym access', 'Locker room', 'Free Wi-Fi'],
    status: 'active', createdAt: '2026-01-01',
  },
  {
    id: 'plan2', name: 'Premium Quarterly', price: 3999, duration: 90, durationType: 'days',
    benefits: ['Gym access', 'Group classes', 'Locker room', 'Personal trainer (1/month)', 'Free Wi-Fi'],
    status: 'active', createdAt: '2026-01-01',
  },
  {
    id: 'plan3', name: 'Elite Annual', price: 12000, duration: 365, durationType: 'days',
    benefits: ['Unlimited gym access', 'All group classes', 'Locker room', 'Personal trainer (4/month)', 'Nutrition consultation', 'Free Wi-Fi', 'Guest passes (2/month)'],
    status: 'active', createdAt: '2026-01-01',
  },
  {
    id: 'plan4', name: 'Day Pass', price: 299, duration: 1, durationType: 'days',
    benefits: ['Single day gym access'],
    status: 'active', createdAt: '2026-01-01',
  },
];

export const DEMO_MEMBERS = [
  {
    id: 'm1', name: 'Arjun Sharma', email: 'arjun@example.com', phone: '+91 98765 43210',
    memberId: 'MP-00001', profileImage: null, createdAt: '2026-09-01',
  },
  {
    id: 'm2', name: 'Priya Patel', email: 'priya@example.com', phone: '+91 87654 32109',
    memberId: 'MP-00002', profileImage: null, createdAt: '2026-09-15',
  },
  {
    id: 'm3', name: 'Rahul Verma', email: 'rahul@example.com', phone: '+91 76543 21098',
    memberId: 'MP-00003', profileImage: null, createdAt: '2026-10-01',
  },
  {
    id: 'm4', name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 65432 10987',
    memberId: 'MP-00004', profileImage: null, createdAt: '2026-10-10',
  },
  {
    id: 'm5', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 54321 09876',
    memberId: 'MP-00005', profileImage: null, createdAt: '2026-10-20',
  },
  {
    id: 'm6', name: 'Meera Nair', email: 'meera@example.com', phone: '+91 43210 98765',
    memberId: 'MP-00006', profileImage: null, createdAt: '2026-11-01',
  },
];

// Active member's QR token is their memberId + a demo token suffix
export const DEMO_MEMBERSHIPS = [
  {
    id: 'ms1', memberId: 'm1', planId: 'plan2', startDate: '2026-10-01', expiryDate: '2026-12-29',
    status: 'active', qrToken: 'MP-00001-QR-DEMO-ACTIVE-TOKEN',
  },
  {
    id: 'ms2', memberId: 'm2', planId: 'plan1', startDate: '2026-10-01', expiryDate: '2026-10-31',
    status: 'expired', qrToken: 'MP-00002-QR-DEMO-EXPIRED-TOKEN',
  },
  {
    id: 'ms3', memberId: 'm3', planId: 'plan3', startDate: '2026-11-01', expiryDate: '2027-10-31',
    status: 'active', qrToken: 'MP-00003-QR-DEMO-ACTIVE-TOKEN',
  },
  {
    id: 'ms4', memberId: 'm4', planId: 'plan1', startDate: '2026-10-10', expiryDate: '2026-11-09',
    status: 'suspended', qrToken: 'MP-00004-QR-DEMO-SUSPENDED-TOKEN',
  },
  {
    id: 'ms5', memberId: 'm5', planId: 'plan2', startDate: '2026-10-20', expiryDate: '2027-01-17',
    status: 'active', qrToken: 'MP-00005-QR-DEMO-ACTIVE-TOKEN',
  },
];

export const DEMO_ENTRY_LOGS = [
  {
    id: 'el1', memberId: 'm1', memberName: 'Arjun Sharma', verificationTime: '2026-11-07T07:30:00',
    result: 'granted', reason: 'Active membership', verifiedBy: 'Admin User',
  },
  {
    id: 'el2', memberId: 'm2', memberName: 'Priya Patel', verificationTime: '2026-11-07T08:15:00',
    result: 'denied', reason: 'Membership expired', verifiedBy: 'Staff Member',
  },
  {
    id: 'el3', memberId: 'm3', memberName: 'Rahul Verma', verificationTime: '2026-11-07T09:00:00',
    result: 'granted', reason: 'Active membership', verifiedBy: 'Admin User',
  },
  {
    id: 'el4', memberId: 'm4', memberName: 'Sneha Reddy', verificationTime: '2026-11-07T09:45:00',
    result: 'denied', reason: 'Membership suspended', verifiedBy: 'Staff Member',
  },
  {
    id: 'el5', memberId: 'm5', memberName: 'Vikram Singh', verificationTime: '2026-11-07T10:30:00',
    result: 'granted', reason: 'Active membership', verifiedBy: 'Admin User',
  },
  {
    id: 'el6', memberId: null, memberName: 'Unknown', verificationTime: '2026-11-07T11:00:00',
    result: 'denied', reason: 'Invalid QR code', verifiedBy: 'Staff Member',
  },
];
