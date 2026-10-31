# GTICC — Global Trade & Investment Commercial Community

Production web platform and administration portal for GTICC.

## Applications & Services

- **Public Frontend:** React 19 + Vite (`http://localhost:5173`)
- **Admin Panel:** Next.js 16 (App Router) + TypeScript (`http://localhost:3000`)
- **Database Engine:** MySQL 8.0 (`gticc_db`)
- **Database Access:** Direct pooling via `mysql2/promise`

---

## Database Access & Links

1. **phpMyAdmin — MySQL Database Management**
   - URL: `http://localhost:8081`
   - Database: `gticc_db`
   - Purpose: View, inspect, search, and manage MySQL tables and records.

2. **GTICC Admin Panel**
   - URL: `http://localhost:3000`
   - Purpose: Manage onboarding applications, review decisions, and notifications.

---

## Getting Started

### 1. Public Frontend
```bash
npm install
npm run dev
```
Available at `http://localhost:5173`.

### 2. Admin Panel
```bash
cd admin
npm install
npm run dev
```
Available at `http://localhost:3000`.
