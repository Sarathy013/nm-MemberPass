import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  Users, UserCheck, UserX, AlertTriangle, TrendingUp,
  QrCode, ArrowUpRight, Calendar, Clock,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const chartData = [
  { month: 'Jun', members: 12 },
  { month: 'Jul', members: 18 },
  { month: 'Aug', members: 24 },
  { month: 'Sep', members: 32 },
  { month: 'Oct', members: 38 },
  { month: 'Nov', members: 42 },
];

function StatCard({ icon: Icon, label, value, sub, color, bgColor }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-2xl font-black text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
      {sub && <div className={`text-xs font-semibold ${color} bg-opacity-10 px-2 py-1 rounded-full ${bgColor}`}>{sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const { getStats, plans } = useData();
  const { user, isDemo } = useAuth();
  const stats = getStats();

  const formatCurrency = (n) => `₹${n.toLocaleString('en-IN')}`;
  const formatTime = (iso) => new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening at your studio today.</p>
        </div>
        {isDemo && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
            ⚠️ Demo data — not production-secure
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Members" value={stats.totalMembers} bgColor="bg-indigo-50" color="text-indigo-600" />
        <StatCard icon={UserCheck} label="Active Members" value={stats.activeMembers} bgColor="bg-emerald-50" color="text-emerald-600" sub="✓ Access granted" />
        <StatCard icon={UserX} label="Expired" value={stats.expiredMembers} bgColor="bg-red-50" color="text-red-500" />
        <StatCard icon={AlertTriangle} label="Suspended" value={stats.suspendedMembers} bgColor="bg-amber-50" color="text-amber-500" />
      </div>

      {/* Revenue */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Membership Revenue</div>
            <div className="text-xs text-gray-400">From active plans</div>
          </div>
          <div className="ml-auto text-2xl font-black text-gray-900">{formatCurrency(stats.totalRevenue)}</div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="members" stroke="#6366f1" strokeWidth={2} fill="url(#grad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent registrations */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Members</h3>
            <a href="/members" className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="space-y-3">
            {stats.recentMembers.map(m => (
              <div key={m.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {m.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900 truncate">{m.name}</div>
                  <div className="text-xs text-gray-400">{m.memberId}</div>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar size={11} />
                  {formatDate(m.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent entry logs */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Verifications</h3>
            <a href="/history" className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="space-y-3">
            {stats.recentLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  log.result === 'granted' ? 'bg-emerald-100' : 'bg-red-100'
                }`}>
                  <QrCode size={15} className={log.result === 'granted' ? 'text-emerald-600' : 'text-red-500'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900 truncate">{log.memberName}</div>
                  <div className="text-xs text-gray-400">{log.reason}</div>
                </div>
                <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  log.result === 'granted' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                }`}>
                  {log.result === 'granted' ? 'Allowed' : 'Denied'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats by plan */}
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-4">Membership Plans Overview</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {plans.filter(p => p.status === 'active').map(plan => (
            <div key={plan.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="font-semibold text-sm text-gray-900 mb-1">{plan.name}</div>
              <div className="text-indigo-600 font-bold">₹{plan.price.toLocaleString('en-IN')}</div>
              <div className="text-xs text-gray-400 mt-0.5">{plan.duration} days</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
