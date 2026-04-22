import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'apps/api/.env' });

neonConfig.webSocketConstructor = ws;

async function inspect() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL not found");

    const adapter = new PrismaNeon({ connectionString });
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("🔍 Inspecting MarketListing table...");
        const columns = await prisma.$queryRawUnsafe(`
            SELECT CAST(column_name AS text) as column_name, CAST(data_type AS text) as data_type
            FROM information_schema.columns 
            WHERE table_name = 'MarketListing';
        `);
        console.log("📊 Columns in MarketListing:", JSON.stringify(columns, null, 2));

        if ((columns as any[]).length === 0) {
            console.log("❌ Table MarketListing NOT FOUND!");
        }

    } catch (err: any) {
        console.error("❌ Inspection failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

inspect();
