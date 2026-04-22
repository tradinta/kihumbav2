import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Polyfill for Neon WebSocket connection
neonConfig.webSocketConstructor = ws;

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const rawUrl = process.env.DATABASE_URL || '';
const connectionString = rawUrl.trim().replace(/^["']|["']$/g, '').trim();

async function main() {
    if (!connectionString) {
        console.error("❌ No DATABASE_URL found in .env");
        return;
    }

    const adapter = new PrismaNeon({ connectionString });
    const prisma = new PrismaClient({ adapter });

    console.log("⚡ Executing Locality Schema Patch...");

    const sqlQueries = [
        // 1. Create AccountType Enum if it doesn't exist
        `DO $$ BEGIN
            CREATE TYPE "AccountType" AS ENUM ('NORMAL', 'BUSINESS', 'GOVERNMENT');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;`,

        // 2. Add locality columns to User table
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "countyId" INTEGER;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "subCounty" TEXT;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "institution" TEXT;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "accountType" "AccountType" DEFAULT 'NORMAL';`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isReserved" BOOLEAN DEFAULT false;`,
    ];

    for (const query of sqlQueries) {
        try {
            await prisma.$executeRawUnsafe(query);
            console.log(`✅ Applied: ${query.split('\n')[0].trim()}`);
        } catch (err: any) {
            if (err.message.includes('already exists')) {
                console.log(`ℹ️ Already exists, skipping: ${query.split('\n')[0].trim()}`);
            } else {
                console.error(`❌ Failed: ${query}`, err.message);
            }
        }
    }

    console.log("\n✅ Database Schema updated with Locality Layer support.");
    await prisma.$disconnect();
}

main().catch((e) => {
    console.error("CRITICAL MIGRATION FAILURE:", e);
    process.exit(1);
});
