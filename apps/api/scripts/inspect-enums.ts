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
        const enums = ['TradeType', 'MarketCategory', 'ItemCondition'];
        
        for (const enumName of enums) {
            console.log(`🔍 Inspecting ${enumName} enum values...`);
            const values = await prisma.$queryRawUnsafe(`
                SELECT CAST(enumlabel AS text) as enumlabel
                FROM pg_enum 
                JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
                WHERE pg_type.typname = '${enumName}';
            `);
            console.log(`📊 Values in ${enumName}:`, JSON.stringify(values, null, 2));
        }


    } catch (err: any) {
        console.error("❌ Inspection failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

inspect();
