require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Stricter limiter on verify endpoint
const verifyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 60,
  message: { message: 'Verification rate limit exceeded.' },
});
app.use('/api/verify', verifyLimiter);

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/members',     require('./routes/members'));
app.use('/api/plans',       require('./routes/plans'));
app.use('/api/memberships', require('./routes/memberships'));
app.use('/api/verify',      require('./routes/verify'));
app.use('/api/logs',        require('./routes/logs'));

// ── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

(async () => {
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.warn('⚠️  Running without database — API endpoints will fail. Use frontend demo mode.');
  }
  app.listen(PORT, () => {
    console.log(`🚀 MemberPass server running on port ${PORT}`);
  });
})();

