import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  Plus, Edit2, ToggleLeft, ToggleRight, Trash2, Check, X, DollarSign, Clock, Zap,
} from 'lucide-react';

function PlanModal({ plan, onClose, onSave }) {
  const isEdit = !!plan;
  const [form, setForm] = useState({
    name: plan?.name || '',
    price: plan?.price || '',
    duration: plan?.duration || 30,
    benefits: plan?.benefits?.join('\n') || '',
    status: plan?.status || 'active',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    setLoading(true);
    setTimeout(() => {
      onSave({
        ...form,
        price: Number(form.price),
        duration: Number(form.duration),
        benefits: form.benefits.split('\n').map(b => b.trim()).filter(Boolean),
      });
      setLoading(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-bold text-gray-900 text-lg">{isEdit ? 'Edit Plan' : 'Create New Plan'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Plan Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Premium Monthly" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="1500" className="input-field" min="0" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (days) *</label>
              <input type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="30" className="input-field" min="1" required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Benefits (one per line)</label>
              <textarea
                value={form.benefits}
                onChange={e => setForm(p => ({ ...p, benefits: e.target.value }))}
                placeholder={"Gym access\nGroup classes\nLocker room"}
                rows={4}
                className="input-field resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : (isEdit ? 'Save Changes' : 'Create Plan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PlansPage() {
  const { plans, addPlan, updatePlan, togglePlanStatus } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState(null);

  const handleSave = (data) => {
    if (editPlan) { updatePlan(editPlan.id, data); }
    else { addPlan(data); }
    setEditPlan(null);
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900">Membership Plans</h2>
          <p className="text-gray-500 text-sm">Create and manage studio membership plans.</p>
        </div>
        <button onClick={() => { setEditPlan(null); setShowModal(true); }} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus size={16} /> Create Plan
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {plans.map(plan => (
          <div key={plan.id} className={`card border-2 transition-all ${plan.status === 'active' ? 'border-transparent hover:border-indigo-200' : 'border-dashed border-gray-200 opacity-70'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Zap className="w-5 h-5 text-indigo-500" />
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${plan.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {plan.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>

            <h3 className="font-bold text-gray-900 text-lg mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-2xl font-black text-indigo-600">₹{plan.price.toLocaleString('en-IN')}</span>
              <span className="text-gray-400 text-sm">/ {plan.duration} days</span>
            </div>

            <ul className="space-y-1.5 my-4 border-t border-gray-50 pt-4">
              {plan.benefits.map(b => (
                <li key={b} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={13} className="text-emerald-500 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
              <button
                onClick={() => { setEditPlan(plan); setShowModal(true); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
              >
                <Edit2 size={13} /> Edit
              </button>
              <button
                onClick={() => togglePlanStatus(plan.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition ${
                  plan.status === 'active'
                    ? 'border border-amber-200 text-amber-600 hover:bg-amber-50'
                    : 'border border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {plan.status === 'active' ? <><ToggleLeft size={14} /> Deactivate</> : <><ToggleRight size={14} /> Activate</>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {(showModal || editPlan) && (
        <PlanModal
          plan={editPlan || undefined}
          onClose={() => { setShowModal(false); setEditPlan(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
