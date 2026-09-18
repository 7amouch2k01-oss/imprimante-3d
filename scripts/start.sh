#!/bin/sh

echo "🚀 Starting deployment bootstrap..."

# 1. Adapt schema if PostgreSQL is present
node scripts/prepare-db.js || true

# 2. Push schema to database
echo "📦 Running prisma db push..."
npx prisma db push --accept-data-loss || true

# 3. Seed database using plain Node (non-blocking)
echo "🌱 Running database seed..."
node prisma/seed.js || true

# 4. Use Railway's injected PORT (default to 3000) and bind to 0.0.0.0
APP_PORT="${PORT:-3000}"
echo "✨ Starting Next.js production server on 0.0.0.0:${APP_PORT}..."
exec npx next start -H 0.0.0.0 -p "${APP_PORT}"
