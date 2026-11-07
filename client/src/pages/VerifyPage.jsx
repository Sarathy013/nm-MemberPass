import { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  Camera, QrCode, CheckCircle, XCircle, AlertTriangle,
  RefreshCw, User, Calendar, CreditCard, Info,
} from 'lucide-react';

// Demo QR tokens for manual testing
const DEMO_TOKENS = [
  { label: 'Active Member (Arjun)', token: 'MP-00001-QR-DEMO-ACTIVE-TOKEN' },
  { label: 'Expired Member (Priya)', token: 'MP-00002-QR-DEMO-EXPIRED-TOKEN' },
  { label: 'Active Member (Rahul)', token: 'MP-00003-QR-DEMO-ACTIVE-TOKEN' },
  { label: 'Suspended Member (Sneha)', token: 'MP-00004-QR-DEMO-SUSPENDED-TOKEN' },
  { label: 'Invalid QR Code', token: 'INVALID-TOKEN-XYZ' },
];

function ResultDisplay({ result, onReset }) {
  if (!result) return null;
  const granted = result.result === 'granted';

  return (
    <div className={`rounded-2xl border-2 p-6 text-center animate-slide-up ${
      granted ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
    }`}>
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
        granted ? 'bg-emerald-100' : 'bg-red-100'
      }`}>
        {granted
          ? <CheckCircle className="w-10 h-10 text-emerald-500" />
          : <XCircle className="w-10 h-10 text-red-500" />
        }
      </div>

      <div className={`text-3xl font-black mb-1 ${granted ? 'text-emerald-700' : 'text-red-700'}`}>
        {granted ? '✓ ACCESS GRANTED' : '✗ ACCESS DENIED'}
      </div>
      <div className={`text-sm font-medium mb-5 ${granted ? 'text-emerald-600' : 'text-red-600'}`}>
        {result.reason}
      </div>

      {result.member && (
        <div className="bg-white rounded-xl p-4 text-left space-y-2.5 mb-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
              {result.member.name[0]}
            </div>
            <div>
              <div className="font-bold text-gray-900">{result.member.name}</div>
              <div className="text-xs text-gray-400">{result.member.memberId}</div>
            </div>
          </div>
          {result.plan && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <CreditCard size={12} className="text-indigo-400" />
                {result.plan.name}
              </div>
              {result.membership && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar size={12} className="text-indigo-400" />
                  Expires {new Date(result.membership.expiryDate).toLocaleDateString('en-IN')}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <button onClick={onReset} className="btn-primary flex items-center justify-center gap-2 mx-auto">
        <RefreshCw size={15} /> Scan Another
      </button>
    </div>
  );
}

export default function VerifyPage() {
  const { verifyQrToken, memberships } = useData();
  const { user } = useAuth();
  const [manualToken, setManualToken] = useState('');
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);

  const doVerify = (token) => {
    if (!token.trim()) return;
    const res = verifyQrToken(token.trim(), user?.name || 'Staff');
    setResult(res);
    setManualToken('');
    stopScanner();
  };

  const stopScanner = () => {
    if (html5QrRef.current) {
      html5QrRef.current.stop().catch(() => {});
      html5QrRef.current.clear();
      html5QrRef.current = null;
    }
    setScanning(false);
  };

  const startScanner = async () => {
    setResult(null);
    setCameraError('');
    setScanning(true);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      await new Promise(r => setTimeout(r, 300));
      const scanner = new Html5Qrcode('qr-reader');
      html5QrRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => { doVerify(decodedText); },
        () => {}
      );
    } catch (err) {
      setCameraError('Camera unavailable or permission denied. Use the manual input below.');
      setScanning(false);
    }
  };

  useEffect(() => {
    return () => { stopScanner(); };
  }, []);

  const reset = () => {
    setResult(null);
    setManualToken('');
    setCameraError('');
  };

  // Get recently generated QR tokens for quick test
  const recentTokens = memberships
    .filter(ms => ms.qrToken && !ms.qrToken.includes('DEMO'))
    .slice(0, 3)
    .map(ms => ({ label: `Generated QR`, token: ms.qrToken }));

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-slide-up">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-gray-900">QR Code Verification</h2>
        <p className="text-gray-500 text-sm">Scan a member's QR code to verify membership and control entry.</p>
      </div>

      {/* Demo notice */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm">
        <Info size={16} className="shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Demo Mode:</span> Use the sample tokens below or scan a generated QR code.
          In production, the backend makes the final access decision — the frontend never trusts client-supplied status.
        </div>
      </div>

      {!result ? (
        <>
          {/* Camera scanner */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Camera size={18} className="text-indigo-500" /> Camera Scanner
            </h3>
            <div
              id="qr-reader"
              className={`w-full rounded-xl overflow-hidden bg-gray-900 ${scanning ? 'min-h-[300px]' : 'hidden'}`}
            />
            {!scanning && (
              <div className="flex items-center justify-center h-40 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <QrCode className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Camera not active</p>
                </div>
              </div>
            )}
            {cameraError && (
              <div className="mt-2 flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                <AlertTriangle size={14} /> {cameraError}
              </div>
            )}
            <div className="flex gap-3 mt-4">
              {!scanning ? (
                <button onClick={startScanner} className="btn-primary flex items-center gap-2 flex-1">
                  <Camera size={16} /> Start Camera
                </button>
              ) : (
                <button onClick={stopScanner} className="btn-danger flex items-center gap-2 flex-1">
                  Stop Scanner
                </button>
              )}
            </div>
          </div>

          {/* Manual input */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <QrCode size={18} className="text-indigo-500" /> Manual Token Entry
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualToken}
                onChange={e => setManualToken(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doVerify(manualToken)}
                placeholder="Paste or type QR token..."
                className="input-field flex-1"
              />
              <button
                onClick={() => doVerify(manualToken)}
                disabled={!manualToken.trim()}
                className="btn-primary px-4 disabled:opacity-50"
              >
                Verify
              </button>
            </div>
          </div>

          {/* Quick demo tokens */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-3">🧪 Demo Test Tokens</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {[...DEMO_TOKENS, ...recentTokens].map(({ label, token }) => (
                <button
                  key={token}
                  onClick={() => doVerify(token)}
                  className="text-left p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition group"
                >
                  <div className="font-medium text-sm text-gray-700 group-hover:text-indigo-700">{label}</div>
                  <div className="font-mono text-xs text-gray-400 truncate mt-0.5">{token}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <ResultDisplay result={result} onReset={reset} />
      )}
    </div>
  );
}

