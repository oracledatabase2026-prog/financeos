# FinanceOS — Enterprise Accounting & ERP System

[![CI](https://github.com/YOUR_USERNAME/financeos/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/financeos/actions)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![NestJS](https://img.shields.io/badge/NestJS-10-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/License-MIT-green)

A full-stack enterprise ERP system with accounting, inventory, payroll, and financial reporting — built with Next.js 15 + NestJS + PostgreSQL.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| **Dashboard** | Real-time KPIs, charts, cash flow analytics |
| **General Ledger** | Chart of accounts, journal entries, trial balance |
| **Accounts Payable** | Supplier invoices, payments, aging reports |
| **Accounts Receivable** | Customer invoices, collections, AR aging |
| **Inventory** | Products, warehouses, stock levels, movements |
| **Financial Reports** | P&L, balance sheet, cash flow, VAT reports |
| **HR & Payroll** | Employees, departments, salary processing |
| **Settings** | Company profile, user roles, permissions |

---

## 🛠 Tech Stack

**Frontend:** Next.js 15 · TypeScript · Tailwind CSS · Shadcn UI · Framer Motion · Recharts · Zustand

**Backend:** NestJS 10 · Prisma ORM · PostgreSQL 16 · JWT Auth · Swagger

**DevOps:** Docker · GitHub Actions · Vercel-ready · Railway-ready

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16 (or Docker)

### 1. Clone
```bash
git clone https://github.com/YOUR_USERNAME/financeos.git
cd financeos
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set your DATABASE_URL and JWT secrets
npx prisma migrate dev
npm run prisma:seed
npm run start:dev
```

Backend runs at: `http://localhost:4000`
API docs at: `http://localhost:4000/api/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
# .env.local already has NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
npm run dev
```

Frontend runs at: `http://localhost:3000`

### 4. Login
```
Email:    admin@financeos.io
Password: Admin@123456
```

---

## 🐳 Docker (Run Everything at Once)

```bash
docker-compose up -d
```

Then open `http://localhost:3000`

---

## ☁️ Deploy to Cloud (Free)

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
# Set env var: NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
```

### Backend → Railway
1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select the `backend` folder as root directory
3. Add environment variables (see `.env.example`)
4. Railway auto-detects Node.js and deploys

### Database → Neon (Free PostgreSQL)
1. Go to [neon.tech](https://neon.tech) → Create project
2. Copy the connection string
3. Set as `DATABASE_URL` in Railway environment variables
4. Run migrations: In Railway shell → `npx prisma migrate deploy && npm run prisma:seed`

---

## 📁 Project Structure

```
financeos/
├── backend/                    # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma       # 25+ table database schema
│   │   └── seed.ts             # Demo data
│   └── src/
│       ├── auth/               # JWT authentication
│       ├── dashboard/          # KPI & analytics APIs
│       ├── ledger/             # General ledger
│       ├── invoices/           # AP & AR
│       ├── inventory/          # Stock management
│       ├── payroll/            # HR & payroll
│       ├── reports/            # Financial reports
│       └── settings/           # Company settings
│
└── frontend/                   # Next.js 15 App
    └── src/
        ├── app/                # Pages (App Router)
        ├── components/
        │   ├── ui/             # Shadcn components
        │   ├── layout/         # Sidebar, header
        │   └── charts/         # Recharts components
        ├── lib/api/            # API client modules
        └── store/              # Zustand state
```

---

## 🔑 Environment Variables

### Backend `.env`
```env
DATABASE_URL="postgresql://user:pass@host:5432/financeos"
JWT_SECRET=your-random-secret-key
JWT_REFRESH_SECRET=your-different-random-key
FRONTEND_URL=http://localhost:3000
PORT=4000
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

## 👥 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@financeos.io | Admin@123456 |
| CFO | cfo@financeos.io | Admin@123456 |
| Accountant | accountant@financeos.io | Admin@123456 |

---

## 📜 License

MIT — see [LICENSE](LICENSE) for details.
