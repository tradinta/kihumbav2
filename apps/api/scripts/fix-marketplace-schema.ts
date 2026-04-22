import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'apps/api/.env' });

neonConfig.webSocketConstructor = ws;

async function fix() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL not found");

    const adapter = new PrismaNeon({ connectionString });
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("🛠️ Fixing MarketListing table schema...");
        
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "MarketListing" ADD COLUMN IF NOT EXISTS "sellerPhone" TEXT;
            ALTER TABLE "MarketListing" ADD COLUMN IF NOT EXISTS "whatsIncluded" TEXT[] DEFAULT ARRAY[]::TEXT[];
            ALTER TABLE "MarketListing" ADD COLUMN IF NOT EXISTS "viewCount" INTEGER DEFAULT 0;
        `);

        console.log("✅ MarketListing table updated successfully!");

    } catch (err: any) {
        console.error("❌ Fix failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

fix();
