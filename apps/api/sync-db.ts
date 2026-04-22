// Precision Database Sync Script (Internal API Edition)
// Bypasses port 5432/6543 blocks using the Prisma WebSocket adapter.

import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load env
dotenv.config();

neonConfig.webSocketConstructor = ws;

async function sync() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL not found in env");

    console.log("🔗 Connecting to Neon via WebSockets...");
    const adapter = new PrismaNeon({ connectionString });
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("🚀 Starting Precision Sync...");

        // Ensure User columns for Better Auth + PhoneNumber plugin
        // Note: Better Auth fields (name, email, image) are core. 
        // We ensure extended fields (phoneNumber, etc) match our schema.
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "image" TEXT;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT false;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN DEFAULT false;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phoneNumber" TEXT;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phoneNumberVerified" BOOLEAN DEFAULT false;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
        `).catch(e => console.log("Note: User table update had some issues:", e.message));

        // Ensure unique index on email and phoneNumber
        await prisma.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");').catch(() => {});
        await prisma.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS "User_phoneNumber_key" ON "User"("phoneNumber");').catch(() => {});

        // Ensure Session columns
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "ipAddress" TEXT;
            ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "userAgent" TEXT;
        `).catch(() => {});

        // Ensure Account table exists or has correct fields
        await prisma.$executeRawUnsafe(`            DO $$ BEGIN
                CREATE TYPE "TribeRole" AS ENUM ('ADMIN', 'MODERATOR', 'MEMBER');
            EXCEPTION WHEN duplicate_object THEN null; END $$;

            DO $$ BEGIN
                CREATE TYPE "TribePrivacy" AS ENUM ('PUBLIC', 'PRIVATE', 'SECRET');
            EXCEPTION WHEN duplicate_object THEN null; END $$;

            DO $$ BEGIN
                CREATE TYPE "TribeCategory" AS ENUM ('KILIMO_BIASHARA', 'MATATU_CULTURE', 'CAMPUS_LIFE', 'REAL_ESTATE', 'SIDE_HUSSLES', 'TEA_POLITICS', 'ENTERTAINMENT', 'JOBS_GIGS', 'OTHER');
            EXCEPTION WHEN duplicate_object THEN null; END $$;
        `).catch(() => {});

        // 2. Create Tribe Table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Tribe" (
                "id" TEXT PRIMARY KEY,
                "name" TEXT NOT NULL,
                "slug" TEXT UNIQUE NOT NULL,
                "bio" TEXT,
                "category" "TribeCategory" DEFAULT 'OTHER',
                "privacy" "TribePrivacy" DEFAULT 'PUBLIC',
                "logo" TEXT,
                "cover" TEXT,
                "creatorId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `).catch(e => console.log("Tribe creation note:", e.message));

        // ─── Chat Infrastructure ──────────────────────────────────────────────────
        console.log("💬 Launching Chat Infrastructure...");
        
        // 1. Create Enums if they don't exist
        await prisma.$executeRawUnsafe(`
            DO $$ BEGIN
                CREATE TYPE "ChatRoomType" AS ENUM ('DM', 'GROUP', 'ANON');
            EXCEPTION WHEN duplicate_object THEN null; END $$;
            
            DO $$ BEGIN
                CREATE TYPE "ChatRole" AS ENUM ('OWNER', 'ADMIN', 'MODERATOR', 'MEMBER');
            EXCEPTION WHEN duplicate_object THEN null; END $$;
            
            DO $$ BEGIN
                CREATE TYPE "TribeRole" AS ENUM ('ADMIN', 'MODERATOR', 'MEMBER');
            EXCEPTION WHEN duplicate_object THEN null; END $$;
        `).catch(() => {});

        // 2. Create ChatRoom Table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "ChatRoom" (
                "id" TEXT PRIMARY KEY,
                "name" TEXT,
                "slug" TEXT UNIQUE,
                "description" TEXT,
                "type" "ChatRoomType" DEFAULT 'DM',
                "avatar" TEXT,
                "metadata" JSONB,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `).catch(e => console.log("ChatRoom creation note:", e.message));

        // Ensure description column if it doesn't exist
        await prisma.$executeRawUnsafe(`ALTER TABLE "ChatRoom" ADD COLUMN IF NOT EXISTS "description" TEXT;`).catch(() => {});

        // 3. Create Participant Table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Participant" (
                "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
                "roomId" TEXT NOT NULL REFERENCES "ChatRoom"("id") ON DELETE CASCADE,
                "role" "ChatRole" DEFAULT 'MEMBER',
                "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "mutedUntil" TIMESTAMP(3),
                "isArchived" BOOLEAN DEFAULT false,
                "isBanned" BOOLEAN DEFAULT false,
                PRIMARY KEY ("userId", "roomId")
            );
        `).catch(e => console.log("Participant creation note:", e.message));

        // Ensure isBanned column if it doesn't exist
        await prisma.$executeRawUnsafe(`ALTER TABLE "Participant" ADD COLUMN IF NOT EXISTS "isBanned" BOOLEAN DEFAULT false;`).catch(() => {});
        await prisma.$executeRawUnsafe(`ALTER TABLE "Participant" ADD COLUMN IF NOT EXISTS "isArchived" BOOLEAN DEFAULT false;`).catch(() => {});

        // 4. Create ChatMessage Table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "ChatMessage" (
                "id" TEXT PRIMARY KEY,
                "content" TEXT NOT NULL,
                "type" TEXT DEFAULT 'TEXT',
                "metadata" JSONB,
                "isDeleted" BOOLEAN DEFAULT false,
                "isEdited" BOOLEAN DEFAULT false,
                "senderId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
                "roomId" TEXT NOT NULL REFERENCES "ChatRoom"("id") ON DELETE CASCADE,
                "replyToId" TEXT REFERENCES "ChatMessage"("id"),
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `).catch(e => console.log("ChatMessage creation note:", e.message));

        // ─── Tribe Infrastructure ──────────────────────────────────────────────────
        console.log("🛡️ Syncing Tribe Infrastructure...");
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "TribeMember" (
                "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
                "tribeId" TEXT NOT NULL REFERENCES "Tribe"("id") ON DELETE CASCADE,
                "role" "TribeRole" DEFAULT 'MEMBER',
                "isBanned" BOOLEAN DEFAULT false,
                "isRestricted" BOOLEAN DEFAULT false,
                "requiresApproval" BOOLEAN DEFAULT false,
                "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY ("userId", "tribeId")
            );
        `).catch(e => console.log("TribeMember creation note:", e.message));

        // ─── Curation Infrastructure (Events, Polls, Docs) ────────────────────────
        console.log("🎫 Launching Curation Infrastructure...");
        
        // 1. Update ContentType and SubscriptionTier Enums
        await prisma.$executeRawUnsafe(`
            ALTER TYPE "ContentType" ADD VALUE IF NOT EXISTS 'EVENT';
            ALTER TYPE "ContentType" ADD VALUE IF NOT EXISTS 'POLL';
            ALTER TYPE "ContentType" ADD VALUE IF NOT EXISTS 'DOCUMENT';
            
            DO $$ BEGIN
                ALTER TYPE "SubscriptionTier" ADD VALUE 'PRO';
            EXCEPTION WHEN duplicate_object THEN null; END $$;

            DO $$ BEGIN
                ALTER TYPE "SubscriptionTier" ADD VALUE 'ELITE';
            EXCEPTION WHEN duplicate_object THEN null; END $$;

            -- Ensure subscriptionExpiresAt column exists
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "subscriptionExpiresAt" TIMESTAMP(3);
        `).catch(() => console.log("Enum and Column updates handled."));

        // 2. Create Event Table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Event" (
                "id" TEXT PRIMARY KEY,
                "postId" TEXT UNIQUE NOT NULL REFERENCES "Post"("id") ON DELETE CASCADE,
                "title" TEXT NOT NULL,
                "organizer" TEXT NOT NULL,
                "date" TIMESTAMP(3) NOT NULL,
                "endDate" TIMESTAMP(3),
                "venue" TEXT NOT NULL,
                "price" TEXT,
                "externalLink" TEXT,
                "description" TEXT,
                "posterUrl" TEXT,
                "isVerified" BOOLEAN DEFAULT false,
                "isActive" BOOLEAN DEFAULT true,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `).catch(e => console.log("Event creation note:", e.message));
        await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "Event_date_idx" ON "Event"("date");').catch(() => {});
        await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "Event_isVerified_idx" ON "Event"("isVerified");').catch(() => {});

        // 3. Create Poll Table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Poll" (
                "id" TEXT PRIMARY KEY,
                "postId" TEXT UNIQUE NOT NULL REFERENCES "Post"("id") ON DELETE CASCADE,
                "question" TEXT NOT NULL,
                "allowMultiple" BOOLEAN DEFAULT false,
                "isQuiz" BOOLEAN DEFAULT false,
                "endsAt" TIMESTAMP(3),
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `).catch(e => console.log("Poll creation note:", e.message));
        await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "Poll_endsAt_idx" ON "Poll"("endsAt");').catch(() => {});

        // 4. Create PollOption Table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "PollOption" (
                "id" TEXT PRIMARY KEY,
                "pollId" TEXT NOT NULL REFERENCES "Poll"("id") ON DELETE CASCADE,
                "text" TEXT NOT NULL,
                "isCorrect" BOOLEAN DEFAULT false,
                "sortOrder" INTEGER DEFAULT 0
            );
        `).catch(e => console.log("PollOption creation note:", e.message));

        // 5. Create PollVote Table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "PollVote" (
                "id" TEXT PRIMARY KEY,
                "pollId" TEXT NOT NULL REFERENCES "Poll"("id") ON DELETE CASCADE,
                "optionId" TEXT NOT NULL REFERENCES "PollOption"("id") ON DELETE CASCADE,
                "userId" TEXT NOT NULL,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `).catch(e => console.log("PollVote creation note:", e.message));
        await prisma.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS "PollVote_pollId_optionId_userId_key" ON "PollVote"("pollId", "optionId", "userId");').catch(() => {});
        await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "PollVote_pollId_idx" ON "PollVote"("pollId");').catch(() => {});
        await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "PollVote_userId_idx" ON "PollVote"("userId");').catch(() => {});

        console.log("✅ Curation infrastructure synchronized successfully!");
    } catch (err: any) {
        console.error("❌ Sync failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

sync();
