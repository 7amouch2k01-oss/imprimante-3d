#!/bin/sh
set -e

echo "🚀 Starting deployment bootstrap..."

# 1. Adapt schema if PostgreSQL is present
node scripts/prepare-db.js || true

# 2. Push schema to database
echo "📦 Running prisma db push..."
npx prisma db push --accept-data-loss || true

# 3. Seed database using plain Node (lightweight, zero compilation overhead)
echo "🌱 Running database seed..."
node prisma/seed.js || true

# 4. Start Next.js server
echo "✨ Starting Next.js production server..."
exec npm run start
