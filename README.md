# CBV 3D Printing & Recycling Platform

A production-grade, multi-lingual (English & French) E-Commerce web application dedicated to next-generation additive manufacturing hardware (FDM, SLA, SLS 3D printers) and a circular polymer recycling initiative ("Bientôt disponible / Coming Soon").

Built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **Lucide Icons**, and **Framer Motion**.

---

## 🚀 Quick Local Development

```bash
# 1. Install dependencies
npm install

# 2. Push database schema & seed catalog data
npm run db:push
npm run db:seed

# 3. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) (auto-routes to `/en` or `/fr` based on browser headers).

---

## 🚂 One-Click Deployment to Railway

### Step 1: Push your Code to GitHub
```bash
git init
git add .
git commit -m "feat: CBV 3D Printing platform ready for Railway"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Step 2: Deploy on Railway
1. Go to [Railway.app](https://railway.app/) and click **New Project**.
2. Select **Provision PostgreSQL** (this instantly creates a managed PostgreSQL database).
3. In the same project canvas, click **New** -> **GitHub Repo** and select your repository.
4. Go to your Web service **Variables** tab and set the following environment variables:

| Variable | Recommended Value / Description |
| :--- | :--- |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` *(Railway automatically links your Postgres instance)* |
| `NEXT_PUBLIC_APP_URL` | `https://${{RAILWAY_PUBLIC_DOMAIN}}` *(or your custom domain)* |
| `JWT_SECRET` | Generate a 32-character random string (e.g., `openssl rand -base64 32`) |
| `NODE_ENV` | `production` |
| `STRIPE_SECRET_KEY` | *(Optional)* `sk_test_...` (Fallback mock mode enabled if not provided) |
| `STRIPE_WEBHOOK_SECRET` | *(Optional)* `whsec_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | *(Optional)* `pk_test_...` |

### Step 3: Automatic Database Migration & Seeding
The project comes pre-configured with `railway.toml`, `Procfile`, and `scripts/prepare-db.js`:
- On deployment, Railway automatically detects whether `DATABASE_URL` is PostgreSQL or SQLite.
- It converts the Prisma schema datasource dynamically, runs `npx prisma db push`, seeds the full 3D printer catalog & admin users, and starts the Next.js server.
- The built-in healthcheck is monitored at `/api/health`.

---

## 🛡️ Architecture & Security Features
- **OWASP Hardening**: HTTP security headers (`Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
- **Input Validation**: Zod schemas for all checkout, waitlist, and auth endpoints.
- **In-Memory Sliding-Window Rate Limiting**: Protection against brute-force and DDoS.
- **RBAC**: Customer & Admin roles with bcrypt password hashing and HTTP-only JWT cookies.
- **Bilingual i18n**: First-class English (`en`) and French (`fr`) support across all routes, metadata, and product technical specifications.
