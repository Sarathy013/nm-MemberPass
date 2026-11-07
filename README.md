# MemberPass 🏋️

## Smart Studio Membership & Access Verification System

---

## Project Description

MemberPass is a full-stack web application that gives fitness studio owners a secure, digital way to manage memberships and control studio entry. Members receive a unique QR code embedded in their digital membership card. When they scan it at the entrance, the system instantly verifies their membership status and either grants or denies entry — automatically, every time.

---

## Problem Statement

Studio owners often struggle to manage memberships manually and prevent expired or inactive members from accessing studio facilities. Paper-based or honour-system approaches lead to revenue loss, security gaps, and administrative overhead.

---

## How Might We?

> **"How might we help studio owners ensure that only members with an active membership plan can securely enter their studio through a simple and reliable digital verification system?"**

---

## Main Features

| Feature | Description |
|---------|-------------|
| 🏠 Landing Page | Professional marketing page explaining MemberPass |
| 🔐 Admin Login | Role-based authentication (admin / staff) |
| 📊 Dashboard | Live stats: total members, active, expired, suspended, revenue |
| 👥 Member Management | Register, edit, search, filter, and delete members |
| 🗂 Membership Plans | Create, price, configure, activate/deactivate plans |
| 📇 Digital Card | Per-member card with unique QR code and plan details |
| 📷 QR Verification | Camera scanner + manual token entry with instant result |
| 📋 Entry History | Full audit log of all verification attempts |
| 🌐 Demo Mode | Works without a backend using realistic sample data |

---

## Five User Actions

1. **Register a new studio member** — Add name, email, phone
2. **Assign an active membership plan** — Select plan, generates QR token
3. **Generate a digital membership card with QR code** — View & download
4. **Scan the QR code at the studio entrance** — Camera or manual entry
5. **Automatically allow or deny entry** — Based on live membership status

---

## Technology Stack

### Frontend
- React.js (Vite)
- JavaScript
- Tailwind CSS v4
- Lucide React (icons)
- React Router v6
- Recharts (analytics)
- qrcode (QR generation)
- html5-qrcode (camera scanning)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs (password hashing)
- express-rate-limit

### Deployment
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## Installation

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- MongoDB Atlas account (optional — app runs in demo mode without it)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/memberpass.git
cd memberpass
```

### 2. Install dependencies

```bash
# Client
cd client && npm install

# Server
cd ../server && npm install
```

### 3. Configure environment variables

```bash
# Server
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Client
cd ../client
cp .env.example .env
# Edit VITE_API_URL if deploying backend separately
```

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT signing | `a_long_random_string` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `https://memberpass.vercel.app` |

### Client (`client/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://memberpass-api.onrender.com` |

> ⚠️ Never commit `.env` files. They are listed in `.gitignore`.

---

## Running the Application

### Development (with backend)

```bash
# Terminal 1 — Backend
cd server
npm run dev   # starts on http://localhost:5000

# Terminal 2 — Frontend
cd client
npm run dev   # starts on http://localhost:5173
```

### Demo Mode (no backend needed)

Just run the frontend:
```bash
cd client
npm run dev
```

The app detects that the backend is unavailable and falls back to demo mode with realistic sample data. Demo mode is clearly labelled in the UI.

**Demo credentials:**
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@memberpass.demo` | `admin123` |
| Staff | `staff@memberpass.demo` | `staff123` |

> ⚠️ **Demo mode is not production-secure.** Verification logic runs client-side. In production the backend must make all access decisions.

### Production Build

```bash
cd client
npm run build   # outputs to client/dist/
```

---

## Demo Mode

If you cannot configure a MongoDB database immediately, MemberPass ships with a full **Demo Mode**:

- Pre-loaded sample members, plans, memberships and entry logs
- Login with the demo credentials above
- All five user actions are fully demonstrable
- QR verification uses pre-generated demo tokens (see the "Demo Test Tokens" panel on the Verify page)
- A yellow banner is always shown when demo mode is active so evaluators know it is not production data

---

## Deployment

### Frontend → Vercel

1. Import the `client/` folder into Vercel
2. Set `VITE_API_URL` to your Render backend URL
3. The included `vercel.json` handles SPA routing

### Backend → Render

1. Connect the `server/` folder to a new Render Web Service
2. Set environment variables in the Render dashboard:
   - `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`
3. The included `render.yaml` pre-configures the service

### Database → MongoDB Atlas

1. Create a free-tier cluster
2. Create a database user and whitelist `0.0.0.0/0` (or Render IPs)
3. Copy the connection string to `MONGODB_URI`

---

## Live Deployment

🌐 **Frontend:** *(Add your Vercel URL here after deployment)*

🔌 **Backend API:** *(Add your Render URL here after deployment)*

---

## Screenshots

*(Add screenshots of your deployed application here)*

| Landing Page | Admin Dashboard |
|---|---|
| *screenshot* | *screenshot* |

| QR Verification | Member Card |
|---|---|
| *screenshot* | *screenshot* |

---

## Project Plan

See [`docs/PLAN.pdf`](docs/PLAN.pdf) for the one-page project plan.

---

## Security Notes

- Passwords are hashed with bcryptjs (salt rounds = 12)
- JWT tokens expire after 7 days
- QR tokens: only their SHA-256 hash is stored in the database
- Backend makes all access decisions — frontend status is never trusted
- Both successful and denied entry attempts are logged
- Rate limiting is applied to all API routes
- Admin-only routes are protected by role-based middleware

---

## Folder Structure

```
memberpass/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AuthContext, DataContext
│   │   ├── data/           # Demo data
│   │   ├── layouts/        # DashboardLayout
│   │   └── pages/          # All page components
│   ├── vercel.json
│   └── package.json
├── server/                 # Node.js + Express backend
│   ├── config/             # Database connection
│   ├── middleware/         # Auth, role guards
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── server.js
├── docs/
│   └── PLAN.pdf            # One-page project plan
├── render.yaml             # Render deployment config
├── .gitignore
├── .env.example
└── README.md
```

