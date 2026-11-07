import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  ArrowLeft, Download, QrCode, Calendar, CreditCard,
  User, Phone, Mail, Shield, RefreshCw,
} from 'lucide-react';
import QRCode from 'qrcode';

function StatusPill({ status }) {
  if (status === 'active')    return <span className="badge-active text-sm px-3 py-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />Active</span>;
  if (status === 'expired')   return <span className="badge-expired text-sm px-3 py-1"><span className="w-2 h-2 rounded-full bg-red-500" />Expired</span>;
  if (status === 'suspended') return <span className="badge-suspended text-sm px-3 py-1"><span className="w-2 h-2 rounded-full bg-amber-500" />Suspended</span>;
  return <span className="badge-inactive text-sm px-3 py-1">No Plan</span>;
}

export default function MemberCardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMemberById, getMembershipByMemberId, plans, assignMembership } = useData();
  const canvasRef = useRef(null);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const member = getMemberById(id);
  const membership = member ? getMembershipByMemberId(member.id) : null;
  const plan = membership ? plans.find(p => p.id === membership.planId) : null;

  useEffect(() => {
    if (membership?.qrToken && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, membership.qrToken, {
        width: 200,
        margin: 1,
        color: { dark: '#1e2a4a', light: '#ffffff' },
      }).catch(console.error);
      QRCode.toDataURL(membership.qrToken, { width: 200, margin: 1 }).then(setQrDataUrl);
    }
  }, [membership?.qrToken]);

  if (!member) {
    return (
      <div className="text-center py-16">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Member not found.</p>
        <Link to="/members" className="btn-primary mt-4 inline-flex items-center gap-2"><ArrowLeft size={15} /> Back to Members</Link>
      </div>
    );
  }

  const expiryDate = membership?.expiryDate ? new Date(membership.expiryDate) : null;
  const today = new Date(); today.setHours(0,0,0,0);
  const daysLeft = expiryDate ? Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)) : null;
  const resolvedStatus = (() => {
    if (!membership) return 'none';
    if (membership.status === 'suspended') return 'suspended';
    if (membership.status === 'expired' || (expiryDate && expiryDate < today)) return 'expired';
    return membership.status;
  })();

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${member.memberId}-qrcode.png`;
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-slide-up">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/members')} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-900">Digital Membership Card</h2>
          <p className="text-gray-500 text-sm">Member profile and QR access code</p>
        </div>
      </div>

      {/* Membership Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-indigo-900 to-purple-900 p-6 shadow-2xl text-white">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col sm:flex-row gap-6">
          {/* Left: Member info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-indigo-300" />
              <span className="text-indigo-200 text-sm font-semibold tracking-widest uppercase">MemberPass</span>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-black shadow-lg border-2 border-white/20">
                {member.name[0]}
              </div>
              <div>
                <div className="text-2xl font-black text-white">{member.name}</div>
                <div className="text-indigo-300 text-sm font-mono">{member.memberId}</div>
              </div>
            </div>

            <div className="space-y-2.5 mb-5">
              <div className="flex items-center gap-2 text-sm text-indigo-200">
                <Mail size={13} className="text-indigo-400" />
                {member.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-indigo-200">
                <Phone size={13} className="text-indigo-400" />
                {member.phone}
              </div>
            </div>

            {plan && (
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-2 text-xs text-indigo-300 font-semibold uppercase tracking-wider">
                  <CreditCard size={11} /> Membership Plan
                </div>
                <div className="font-bold text-white">{plan.name}</div>
                <div className="flex items-center gap-2 text-xs text-indigo-200">
                  <Calendar size={11} />
                  {membership?.startDate} → {membership?.expiryDate}
                </div>
                {daysLeft !== null && daysLeft > 0 && (
                  <div className="text-xs text-emerald-300 font-semibold">{daysLeft} days remaining</div>
                )}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2">
              <StatusPill status={resolvedStatus} />
            </div>
          </div>

          {/* Right: QR Code */}
          <div className="flex flex-col items-center gap-3">
            {membership?.qrToken ? (
              <>
                <div className="bg-white rounded-2xl p-3 shadow-xl">
                  <canvas ref={canvasRef} className="block" />
                </div>
                <div className="text-xs text-indigo-300 text-center">Scan to verify entry</div>
                <button
                  onClick={downloadQr}
                  className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
                >
                  <Download size={12} /> Download QR
                </button>
              </>
            ) : (
              <div className="bg-white/10 rounded-2xl p-6 text-center">
                <QrCode className="w-12 h-12 text-white/40 mx-auto mb-2" />
                <div className="text-white/50 text-xs">No plan assigned</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {!membership ? (
          <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl flex items-center gap-2 flex-1">
            ⚠️ No membership plan assigned. Go to Members and assign a plan to generate a QR code.
          </div>
        ) : (
          <Link to="/members" className="btn-secondary flex items-center gap-2">
            <ArrowLeft size={15} /> Back to Members
          </Link>
        )}
      </div>

      {/* Plan benefits */}
      {plan && (
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-3">Plan Benefits</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {plan.benefits.map(b => (
              <div key={b} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                {b}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

