# CBV-3D PRINTING — Backend & Database Server Layer

Modular backend architecture built with **Node.js**, **Prisma ORM**, **PostgreSQL/SQLite**, and **Stripe**.

---

## 🗂️ Architecture & Folder Structure

`
backend/
├── prisma/
│   ├── schema.prisma        # Prisma relational schema (User, Product, ProductTranslation, Order, OrderItem, RecyclingWaitlist)
│   └── seed.ts              # Live seed script with 7 realistic 3D printers, dual translations (EN/FR), users, orders
├── src/
│   ├── api/
│   │   ├── products/        # GET /api/products?lang=en (dynamic fallback localization)
│   │   ├── checkout/        # POST /api/checkout (Stripe checkout session generator + stock deduction)
│   │   ├── recycling/       # POST /api/recycling/subscribe (recycling waitlist validator)
│   │   └── auth/            # POST /api/auth (User JWT login & registration)
│   └── lib/
│       ├── db.ts            # Prisma client instance singleton
│       ├── stripe.ts        # Stripe SDK client & environment detector
│       ├── validations.ts   # Zod validation schemas
│       ├── security.ts      # Rate limiters & sanitizers
│       ├── auth.ts          # Password hashing & JWT signing
│       └── env.ts           # Runtime environment schema validation
├── .env                     # Local environment variables
├── .env.example             # Template environment variables
├── package.json             # Backend dependencies & npm scripts
└── tsconfig.json            # TypeScript configuration
`

---

## 🚀 Setup & Execution Commands

### 1. Synchronize Database Schema
`ash
cd backend
npx prisma db push
`

### 2. Run Live Seed Dataset
`ash
npm run db:seed
`

### 3. Generate Prisma Client
`ash
npm run db:generate
`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/products?lang=en | Retrieves localized products with fallback localization (en/fr), category filter, and search |
| POST | /api/checkout | Generates Stripe checkout session with verified stock & prices, stores Order & OrderItems |
| POST | /api/recycling/subscribe | Validates & stores waitlist subscribers with preferred language ('en' | 'fr') |
| POST | /api/auth | User registration and authentication with JWT and bcrypt |
