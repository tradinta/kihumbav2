// The Great Migration Script (WebSocket Edition)
// Synchronizes the Neon database with schema.prisma bypassing port 5432/6543.

import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import * as dotenv from 'dotenv';

dotenv.config();
neonConfig.webSocketConstructor = ws;

async function migrate() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL not found");

    const adapter = new PrismaNeon({ connectionString });
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("🚀 Starting The Great Migration...");

        // 1. Fix Enums
        console.log("🔹 Aligning Enums...");
        await prisma.$executeRawUnsafe(`
            -- Fix Gender
            ALTER TYPE "Gender" ADD VALUE IF NOT EXISTS 'OTHERS';
            
            -- Fix ContentType
            ALTER TYPE "ContentType" ADD VALUE IF NOT EXISTS 'VIDEO';
            ALTER TYPE "ContentType" ADD VALUE IF NOT EXISTS 'RESHARE';
            ALTER TYPE "ContentType" ADD VALUE IF NOT EXISTS 'QUOTE';

            -- New Required Enums
            DO $$ BEGIN
                CREATE TYPE "CommentTargetType" AS ENUM ('POST', 'MARKET_LISTING', 'KAO_LISTING', 'VIDEO', 'TRIBE_POST');
            EXCEPTION WHEN duplicate_object THEN null; END $$;

            DO $$ BEGIN
                CREATE TYPE "PropertyType" AS ENUM ('SINGLE_ROOM', 'BEDSITTER', 'STUDIO', 'ONE_BEDROOM', 'TWO_BEDROOM', 'THREE_BEDROOM', 'DOUBLE_ROOM');
            EXCEPTION WHEN duplicate_object THEN null; END $$;

            DO $$ BEGIN
                CREATE TYPE "UtilityType" AS ENUM ('TOKEN', 'INCLUDED', 'PAID_EXTRA');
            EXCEPTION WHEN duplicate_object THEN null; END $$;
        `);

        // 2. Modernize User Table
        console.log("🔹 Modernizing User table...");
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "numericId" SERIAL;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "town" TEXT;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "website" TEXT;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "coverPhoto" TEXT;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "interests" TEXT[];
            ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
            
            -- Ensure numericId is unique
            CREATE UNIQUE INDEX IF NOT EXISTS "User_numericId_key" ON "User"("numericId");
        `);

        // 3. Modernize Post & Comment Tables
        console.log("🔹 Upgrading Post & Comment structures...");
        await prisma.$executeRawUnsafe(`
            -- Post
            ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "media" JSONB;
            ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "originalPostId" TEXT;
            ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "tribeId" TEXT;

            -- Comment
            ALTER TABLE "Comment" ALTER COLUMN "postId" DROP NOT NULL;
            ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "targetType" "CommentTargetType" DEFAULT 'POST';
            ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "marketListingId" TEXT;
            ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "kaoListingId" TEXT;
            ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "tribeId" TEXT;
        `);

        // 4. Create missing Video Table
        console.log("🔹 Creating Multimedia Infrastructure...");
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Video" (
                "id" TEXT NOT NULL,
                "title" TEXT NOT NULL,
                "description" TEXT,
                "uploadId" TEXT,
                "assetId" TEXT,
                "playbackId" TEXT,
                "duration" DOUBLE PRECISION,
                "status" TEXT NOT NULL DEFAULT 'uploading',
                "isSpark" BOOLEAN NOT NULL DEFAULT false,
                "viewCount" INTEGER NOT NULL DEFAULT 0,
                "authorId" TEXT NOT NULL,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
            );
        `);

        console.log("✅ The Great Migration is complete!");
    } catch (err: any) {
        console.error("❌ Migration failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

migrate();

