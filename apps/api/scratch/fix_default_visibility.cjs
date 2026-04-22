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
  console.log('--- Surgical Database Visibility Repair Pulse Starting ---');
  
  try {
    console.log('Bridging to Neon archives via WebSockets...');
    
    // 1. Set the default for future records
    console.log('Executing: ALTER TABLE "Video" ALTER COLUMN "visibility" SET DEFAULT \'PRIVATE\'');
    await prisma.$executeRawUnsafe(`ALTER TABLE "Video" ALTER COLUMN "visibility" SET DEFAULT 'PRIVATE'`);
    
    // 2. Optional: Fix existing ready/uploading videos that might be incorrectly public
    console.log('Patching existing unpublished assets to PRIVATE...');
    await prisma.$executeRawUnsafe(`
      UPDATE "Video" 
      SET "visibility" = 'PRIVATE' 
      WHERE "visibility" = 'PUBLIC' 
      AND "createdAt" > NOW() - INTERVAL '1 hour'
      AND NOT EXISTS (SELECT 1 FROM "Post" WHERE "Post"."videoId" = "Video"."id")
    `);

    console.log('--- Surgical Repair Pulse COMPLETE: Default Visibility is now PRIVATE ---');

  } catch (err) {
    console.error('CRITICAL SECTOR FAILURE: Database repair pulse failed');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
