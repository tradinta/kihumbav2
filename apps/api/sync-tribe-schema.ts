// Tribe Schema Sync — Bypassing TCP with WebSockets
import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import * as dotenv from 'dotenv';

dotenv.config();
neonConfig.webSocketConstructor = ws;

async function run() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL not found");

    const adapter = new PrismaNeon({ connectionString });
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("🚀 Starting Tribe Schema Sync (WebSocket Mode)...");
        
        await prisma.$executeRawUnsafe(`
            -- 1. Create Enums if they don't exist
            DO $$ BEGIN
                CREATE TYPE "TribeCategory" AS ENUM ('TECHNOLOGY', 'FINANCE', 'HEALTH', 'EDUCATION', 'LIFESTYLE', 'BUSINESS', 'ENTERTAINMENT', 'ART', 'SPORTS', 'OTHER');
            EXCEPTION WHEN duplicate_object THEN null; END $$;

            DO $$ BEGIN
                CREATE TYPE "TribePostVisibility" AS ENUM ('EVERYONE', 'MEMBERS');
            EXCEPTION WHEN duplicate_object THEN null; END $$;

            -- 2. Add columns to Tribe table
            ALTER TABLE "Tribe" ADD COLUMN IF NOT EXISTS "category" "TribeCategory" DEFAULT 'OTHER';
            ALTER TABLE "Tribe" ADD COLUMN IF NOT EXISTS "rules" TEXT[] DEFAULT ARRAY[]::TEXT[];
            ALTER TABLE "Tribe" ADD COLUMN IF NOT EXISTS "visitCount" INTEGER DEFAULT 0;
            ALTER TABLE "Tribe" ADD COLUMN IF NOT EXISTS "postVisibility" "TribePostVisibility" DEFAULT 'EVERYONE';
            ALTER TABLE "Tribe" ADD COLUMN IF NOT EXISTS "creatorId" TEXT;

            -- 3. TribeVisit table
            CREATE TABLE IF NOT EXISTS "TribeVisit" (
                "id" TEXT NOT NULL,
                "tribeId" TEXT NOT NULL,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "TribeVisit_pkey" PRIMARY KEY ("id")
            );

            -- 4. TribeInvite table
            CREATE TABLE IF NOT EXISTS "TribeInvite" (
                "id" TEXT NOT NULL,
                "code" TEXT NOT NULL,
                "tribeId" TEXT NOT NULL,
                "inviterId" TEXT NOT NULL,
                "maxUses" INTEGER,
                "usedCount" INTEGER NOT NULL DEFAULT 0,
                "expiresAt" TIMESTAMP(3),
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "TribeInvite_pkey" PRIMARY KEY ("id")
            );

            -- 5. Indexes
            CREATE UNIQUE INDEX IF NOT EXISTS "TribeInvite_code_key" ON "TribeInvite"("code");
            CREATE INDEX IF NOT EXISTS "TribeVisit_tribeId_idx" ON "TribeVisit"("tribeId");
            CREATE INDEX IF NOT EXISTS "TribeVisit_createdAt_idx" ON "TribeVisit"("createdAt");
        `);

        console.log("✅ Schema updated successfully over WebSockets.");

    } catch (err: any) {
        console.error("❌ Sync failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

run();
