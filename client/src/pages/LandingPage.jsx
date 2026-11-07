import { Link } from 'react-router-dom';
import {
  Shield, QrCode, Users, BarChart3, ArrowRight,
  Zap, Lock, Smartphone, ChevronRight,
} from 'lucide-react';

const features = [
  { icon: QrCode, title: 'QR-Based Verification', desc: 'Each member gets a unique encrypted QR code. Scan at entry to instantly verify membership status.' },
  { icon: Shield, title: 'Secure Access Control', desc: 'Only active members gain entry. Expired and suspended memberships are automatically blocked.' },
  { icon: Users, title: 'Member Management', desc: 'Register members, assign plans, track expiry dates and manage your entire studio roster in one place.' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Monitor active memberships, revenue, entry frequency and growth trends through a live dashboard.' },
  { icon: Zap, title: 'Instant Results', desc: 'Verification happens in under a second. No delays. No manual checks. No human error.' },
  { icon: Smartphone, title: 'Mobile-Friendly', desc: 'Works perfectly on phones, tablets and desktops. Receptionists can verify on any device.' },
];

const steps = [
  { n: '01', title: 'Register Member', desc: 'Add member details and assign a membership plan to generate their digital card.' },
  { n: '02', title: 'Get Digital Card', desc: 'Member receives a digital card with a unique QR code tied to their active plan.' },
  { n: '03', title: 'Scan at Entry', desc: 'Staff scans the QR code using any device camera at the studio entrance.' },
  { n: '04', title: 'Auto Access Decision', desc: 'System instantly allows or denies entry based on live membership status.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-900 font-bold text-xl tracking-tight">MemberPass</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <a href="#features" className="hover:text-indigo-600 transition">Features</a>
              <a href="#how-it-works" className="hover:text-indigo-600 transition">How it works</a>
              <a href="#contact" className="hover:text-indigo-600 transition">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition">Sign in</Link>
              <Link to="/login" className="btn-primary text-sm py-2 px-4">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-navy-900 to-indigo-950 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-medium mb-6">
            <Zap size={14} />
            Smart Studio Access Verification
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-6">
            Your Membership.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Your Access.
            </span>
            <br />
            Your Studio.
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            MemberPass gives studio owners a secure, digital membership verification system.
            Only active members get in — automatically, every time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 shadow-xl hover:shadow-indigo-500/30"
            >
              Get Started Free
              <ArrowRight size={20} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 border border-white/20"
            >
              See Features
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[['100%', 'Accurate'], ['< 1s', 'Verification'], ['0', 'Unauthorized entries']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-white">{val}</div>
                <div className="text-slate-400 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Features</div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Everything your studio needs</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">A complete membership management platform built for fitness studios of all sizes.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center mb-4 transition">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Process</div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">How MemberPass works</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">From registration to entry — the complete flow in four simple steps.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map(({ n, title, desc }, i) => (
              <div key={n} className="relative text-center group">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent" />
                )}
                <div className="relative z-10 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100 group-hover:border-indigo-300 flex items-center justify-center mb-4 transition-all duration-300">
                  <span className="text-2xl font-black text-indigo-500">{n}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-3xl mx-auto text-center">
          <Lock className="w-12 h-12 text-white/80 mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-4">Ready to secure your studio?</h2>
          <p className="text-indigo-200 text-lg mb-8">Join studios already using MemberPass to manage memberships and control access.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-indigo-50 transition shadow-xl"
          >
            Start for Free
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Contact / Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">MemberPass</span>
            </div>
            <div className="text-sm text-center">
              <p>Smart Studio Membership &amp; Access Verification System</p>
              <p className="mt-1 text-gray-500">© 2026 MemberPass. All rights reserved.</p>
            </div>
            <div className="flex gap-4 text-sm">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#how-it-works" className="hover:text-white transition">How it works</a>
              <Link to="/login" className="hover:text-white transition">Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
