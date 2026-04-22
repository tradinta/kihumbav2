// Final Database Sync (Fixing numericId)
import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import * as dotenv from 'dotenv';

dotenv.config();

neonConfig.webSocketConstructor = ws;

async function sync() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL not found");

    const adapter = new PrismaNeon({ connectionString });
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("🚀 Injecting missing numericId column...");

        // Note: Using SERIAL to handle auto-increment and adding UNIQUE constraint
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "numericId" SERIAL;
            CREATE UNIQUE INDEX IF NOT EXISTS "User_numericId_key" ON "User"("numericId");
        `);

        console.log("✅ numericId synchronized successfully!");
    } catch (err: any) {
        console.error("❌ Sync failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

sync();
