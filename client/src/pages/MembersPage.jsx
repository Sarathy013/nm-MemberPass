import { useState, useMemo, useCallback } from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import {
  UserPlus, Search, Edit2, Trash2, QrCode, Eye,
  Filter, X,
} from 'lucide-react';
import AddMemberModal from '../components/AddMemberModal';
import AssignPlanModal from '../components/AssignPlanModal';

const STATUS_OPTIONS = ['all', 'active', 'expired', 'suspended', 'none'];

function StatusBadge({ status }) {
  if (status === 'active') return <span className="badge-active"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Active</span>;
  if (status === 'expired') return <span className="badge-expired"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Expired</span>;
  if (status === 'suspended') return <span className="badge-suspended"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Suspended</span>;
  return <span className="badge-inactive">No Plan</span>;
}

export default function MembersPage() {
  const { members, memberships, plans, deleteMember } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [assignMember, setAssignMember] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const getMemberStatus = useCallback((memberId) => {
    const ms = memberships
      .filter(m => m.memberId === memberId && m.status !== 'superseded')
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];
    if (!ms) return 'none';
    if (ms.status === 'suspended') return 'suspended';
    if (ms.status === 'expired') return 'expired';
    const expiry = new Date(ms.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expiry < today) return 'expired';
    if (ms.status === 'active') return 'active';
    return 'none';
  }, [memberships]);

  const getMembership = useCallback((memberId) => {
    return memberships
      .filter(ms => ms.memberId === memberId && ms.status !== 'superseded')
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];
  }, [memberships]);

  const getPlan = useCallback((planId) => plans.find(p => p.id === planId), [plans]);

  const filtered = useMemo(() => {
    return members.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.memberId.toLowerCase().includes(search.toLowerCase());
      const status = getMemberStatus(m.id);
      const matchStatus = statusFilter === 'all' || status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [members, search, statusFilter, getMemberStatus]);

  const handleDelete = (id) => {
    deleteMember(id);
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900">Members ({members.length})</h2>
          <p className="text-gray-500 text-sm">Manage studio members and their memberships.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <UserPlus size={16} /> Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="card py-3 px-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="input-field py-2 w-auto"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Member</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Plan</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Expiry</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No members found</td></tr>
              ) : filtered.map(member => {
                const ms = getMembership(member.id);
                const plan = ms ? getPlan(ms.planId) : null;
                const status = getMemberStatus(member.id);
                return (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {member.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{member.name}</div>
                          <div className="text-xs text-gray-400">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{member.memberId}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-gray-600">{plan?.name || <span className="text-gray-300">—</span>}</td>
                    <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500">
                      {ms?.expiryDate ? new Date(ms.expiryDate).toLocaleDateString('en-IN') : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setAssignMember(member)}
                          title="Assign Plan"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        >
                          <QrCode size={15} />
                        </button>
                        <Link
                          to={`/members/${member.id}`}
                          title="View Card"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition"
                        >
                          <Eye size={15} />
                        </Link>
                        <button
                          onClick={() => setEditMember(member)}
                          title="Edit Member"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(member.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAdd && <AddMemberModal onClose={() => setShowAdd(false)} />}
      {editMember && (
        <AddMemberModal
          initialData={editMember}
          onClose={() => setEditMember(null)}
        />
      )}
      {assignMember && <AssignPlanModal member={assignMember} onClose={() => setAssignMember(null)} />}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Member?</h3>
            <p className="text-gray-500 text-sm mb-5">This action cannot be undone. All membership data will be removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="btn-danger flex-1">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
