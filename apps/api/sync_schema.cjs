const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = (process.env.DATABASE_URL || '').trim().replace(/^["']|["']$/g, '').trim();
neonConfig.webSocketConstructor = ws;

async function main() {
  console.log('--- High-Fidelity Schema Sync Starting ---');
  
  const adapter = new PrismaNeon({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const sqlPath = path.join(__dirname, 'kihumba_schema_utf8.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Better SQL cleaning: remove all -- comments
    const cleanedSql = sql
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n');

    const statements = cleanedSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    console.log(`Prepared ${statements.length} SQL statements for injection.`);

    for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        try {
            await prisma.$executeRawUnsafe(stmt);
        } catch (err) {
            if (err.message.includes('already exists') || err.message.includes('already defined')) {
                // Skip existing objects
            } else {
                console.error(`Statement ${i + 1} failed:`, err.message);
            }
        }
    }

    console.log('--- Schema Sync Pulse Complete ---');
    console.log('SUCCESS: Missing tables should now be live in the archives.');

  } catch (err) {
    console.error('CRITICAL SECTOR FAILURE: Schema Injection failed');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
