#!/bin/sh
set -e

echo "🚀 Starting CBV 3D Printing deployment..."

# Seed MongoDB (idempotent — safe to run every time)
echo "🌱 Running database seed..."
node scripts/seed.js || true

# Start Next.js bound to Railway's dynamic PORT
APP_PORT="${PORT:-3000}"
echo "✨ Starting Next.js on 0.0.0.0:${APP_PORT}..."
exec npx next start -H 0.0.0.0 -p "${APP_PORT}"
