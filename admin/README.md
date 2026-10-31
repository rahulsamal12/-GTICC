# GTICC Admin Panel & API Backend

Administrative management portal and REST API for GTICC (Global Trade & Investment Commercial Community).

Built with Next.js 16 (App Router), TypeScript, and MySQL (`mysql2/promise`).

## Database Access & Links

1. **phpMyAdmin — MySQL Database Management**
   - URL: `http://localhost:8081`
   - Database: `gticc_db`
   - Purpose: View, inspect, search, and manage MySQL tables and records.

2. **GTICC Admin Panel**
   - URL: `http://localhost:3000`
   - Purpose: Manage onboarding applications, review decisions, and notifications.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker Deployment

To launch the entire stack (MySQL, Admin Panel, phpMyAdmin):

```bash
docker compose up -d
```
- Admin Panel: `http://localhost:3000`
- phpMyAdmin: `http://localhost:8081`
- MySQL Host Port: `127.0.0.1:3307`
