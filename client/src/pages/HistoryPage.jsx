import { useState } from 'react';
import { useData } from '../context/DataContext';
import { CheckCircle, XCircle, Search, Filter, Download, Clock } from 'lucide-react';

export default function HistoryPage() {
  const { entryLogs } = useData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = entryLogs.filter(log => {
    const matchSearch = log.memberName?.toLowerCase().includes(search.toLowerCase()) ||
      log.reason?.toLowerCase().includes(search.toLowerCase()) ||
      log.verifiedBy?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || log.result === filter;
    return matchSearch && matchFilter;
  });

  const grantedCount = entryLogs.filter(l => l.result === 'granted').length;
  const deniedCount  = entryLogs.filter(l => l.result === 'denied').length;

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  };

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-gray-900">Entry History</h2>
        <p className="text-gray-500 text-sm">All membership verification attempts and their results.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card py-4 text-center">
          <div className="text-2xl font-black text-gray-900">{entryLogs.length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Total Scans</div>
        </div>
        <div className="card py-4 text-center">
          <div className="text-2xl font-black text-emerald-600">{grantedCount}</div>
          <div className="text-xs text-gray-500 mt-0.5">Access Granted</div>
        </div>
        <div className="card py-4 text-center">
          <div className="text-2xl font-black text-red-500">{deniedCount}</div>
          <div className="text-xs text-gray-500 mt-0.5">Access Denied</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card py-3 px-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, reason, staff..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field py-2 w-auto">
            <option value="all">All Results</option>
            <option value="granted">Access Granted</option>
            <option value="denied">Access Denied</option>
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date &amp; Time</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Verified By</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No records found</td></tr>
              ) : filtered.map(log => {
                const { date, time } = formatDateTime(log.verificationTime);
                return (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                          log.result === 'granted' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {log.memberName?.[0] || '?'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{log.memberName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <div className="text-gray-700 font-medium">{date}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock size={10} /> {time}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500">{log.verifiedBy}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-sm">{log.reason}</td>
                    <td className="px-5 py-3.5">
                      {log.result === 'granted' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                          <CheckCircle size={11} /> Granted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                          <XCircle size={11} /> Denied
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

