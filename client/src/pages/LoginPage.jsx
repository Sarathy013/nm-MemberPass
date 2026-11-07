import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Eye, EyeOff, AlertCircle, Info } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Invalid credentials.');
    }
  };

  const fillDemo = (role) => {
    const creds = role === 'admin'
      ? { email: 'admin@memberpass.demo', password: 'admin123' }
      : { email: 'staff@memberpass.demo', password: 'staff123' };
    setForm(creds);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 px-8 pt-8 pb-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-white font-black text-2xl">MemberPass</h1>
            <p className="text-indigo-200 text-sm mt-1">Studio Access Management</p>
          </div>

          {/* Body */}
          <div className="px-8 py-6">
            <h2 className="text-gray-900 font-bold text-xl mb-1">Welcome back</h2>
            <p className="text-gray-500 text-sm mb-6">Sign in to your admin dashboard</p>

            {/* Demo credentials banner */}
            <div className="mb-5 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
              <div className="flex items-start gap-2 text-indigo-700 text-xs mb-2">
                <Info size={13} className="shrink-0 mt-0.5" />
                <span className="font-semibold">Demo Mode — use these credentials:</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('admin')}
                  className="flex-1 text-xs py-1.5 px-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold transition"
                >
                  Admin Login
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('staff')}
                  className="flex-1 text-xs py-1.5 px-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold transition"
                >
                  Staff Login
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle size={15} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : 'Sign In'}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-5 text-center">
          <Link to="/" className="text-slate-400 hover:text-white text-sm transition">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
