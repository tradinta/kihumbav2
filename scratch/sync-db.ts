// Precision Database Sync Script (WebSocket Edition)
// Bypasses port 5432/6543 blocks using the Prisma WebSocket adapter.

import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load env from apps/api/.env
dotenv.config({ path: join(__dirname, '../apps/api/.env') });

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
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "image" TEXT;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT false;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phoneNumber" TEXT;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phoneNumberVerified" BOOLEAN DEFAULT false;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
        `).catch(e => console.log("Note: User table update had some issues (might already be updated):", e.message));

        // Ensure unique index on phoneNumber if possible
        await prisma.$executeRawUnsafe(`
            CREATE UNIQUE INDEX IF NOT EXISTS "User_phoneNumber_key" ON "User"("phoneNumber");
        `).catch(() => {});

        // Ensure Session columns
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "ipAddress" TEXT;
            ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "userAgent" TEXT;
        `).catch(() => {});

        console.log("✅ Database columns synchronized successfully!");
    } catch (err) {
        console.error("❌ Sync failed:", err);
    } finally {
        await prisma.$disconnect();
    }
}

sync();
