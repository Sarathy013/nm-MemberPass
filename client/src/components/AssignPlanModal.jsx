import { useState } from 'react';
import { useData } from '../context/DataContext';
import { X, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

export default function AssignPlanModal({ member, onClose }) {
  const { plans, assignMembership, getMembershipByMemberId } = useData();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const activePlans = plans.filter(p => p.status === 'active');
  const currentMs = getMembershipByMemberId(member.id);

  const handleAssign = () => {
    if (!selectedPlan) return;
    setLoading(true);
    setTimeout(() => {
      assignMembership(member.id, selectedPlan);
      setLoading(false);
      setSuccess(true);
      setTimeout(onClose, 1500);
    }, 500);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Plan Assigned!</h3>
          <p className="text-gray-500 text-sm">Membership card and QR code have been generated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">Assign Membership Plan</h2>
            <p className="text-xs text-gray-400 mt-0.5">For: {member.name} ({member.memberId})</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {currentMs && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-xs flex items-start gap-2">
              <AlertCircle size={13} className="shrink-0 mt-0.5" />
              Current plan ({currentMs.planId}) will be superseded by the new assignment.
            </div>
          )}

          <label className="block text-sm font-semibold text-gray-700 mb-3">Select Plan</label>
          <div className="space-y-2.5 mb-5">
            {activePlans.map(plan => (
              <label
                key={plan.id}
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPlan === plan.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={selectedPlan === plan.id}
                  onChange={() => setSelectedPlan(plan.id)}
                  className="mt-0.5 accent-indigo-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 text-sm">{plan.name}</span>
                    <span className="font-bold text-indigo-600">₹{plan.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{plan.duration} days validity</div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {plan.benefits.slice(0, 3).map(b => (
                      <span key={b} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{b}</span>
                    ))}
                    {plan.benefits.length > 3 && (
                      <span className="text-xs text-gray-400">+{plan.benefits.length - 3} more</span>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button
              onClick={handleAssign}
              disabled={!selectedPlan || loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : (
                <><CreditCard size={15} /> Assign Plan</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
