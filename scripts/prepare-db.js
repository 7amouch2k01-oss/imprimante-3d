const fs = require('fs');
const path = require('path');

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

const dbUrl = process.env.DATABASE_URL || '';
const isPostgres = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://');

if (isPostgres) {
  if (schema.includes('provider = "sqlite"')) {
    console.log('🔄 Switching Prisma schema datasource provider from SQLite to PostgreSQL...');
    schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
    fs.writeFileSync(schemaPath, schema, 'utf-8');
    console.log('✅ Updated prisma/schema.prisma for PostgreSQL datasource.');
  } else {
    console.log('ℹ️ Prisma schema already configured for PostgreSQL.');
  }
} else {
  console.log('ℹ️ Running with SQLite datasource.');
}
