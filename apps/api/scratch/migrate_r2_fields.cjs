const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from apps/api/.env
dotenv.config({ path: 'C:/Users/My PC/Desktop/Personal Projects/kihumba.com/apps/api/.env' });

const connectionString = (process.env.DATABASE_URL || '').trim().replace(/^["']|["']$/g, '').trim();
neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Surgical R2 Schema Migration Pulse Starting ---');
  
  try {
    console.log('Bridging to Neon archives via WebSockets...');
    
    // 1. Add videoUrl column
    console.log('Executing: ALTER TABLE "Video" ADD COLUMN IF NOT EXISTS "videoUrl" TEXT');
    await prisma.$executeRawUnsafe(`ALTER TABLE "Video" ADD COLUMN IF NOT EXISTS "videoUrl" TEXT`);
    
    // 2. Add r2Key column
    console.log('Executing: ALTER TABLE "Video" ADD COLUMN IF NOT EXISTS "r2Key" TEXT');
    await prisma.$executeRawUnsafe(`ALTER TABLE "Video" ADD COLUMN IF NOT EXISTS "r2Key" TEXT`);

    console.log('--- Surgical Migration Pulse COMPLETE: R2 Storage Coordinates Forged ---');

  } catch (err) {
    console.error('CRITICAL SECTOR FAILURE: Database migration pulse failed');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
