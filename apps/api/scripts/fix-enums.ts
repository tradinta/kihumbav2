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
        console.log("🛠️ Fixing TradeType enum values...");
        
        // Add BUY and TRADE_CASH to the existing TradeType enum
        // PostgreSQL allows adding values to enums via ALTER TYPE ... ADD VALUE
        await prisma.$executeRawUnsafe(`
            ALTER TYPE "TradeType" ADD VALUE IF NOT EXISTS 'BUY';
            ALTER TYPE "TradeType" ADD VALUE IF NOT EXISTS 'TRADE_CASH';
        `);

        console.log("✅ TradeType enum updated successfully!");

    } catch (err: any) {
        console.error("❌ Fix failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

fix();
