// Universal Database Diagnostic
import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import * as dotenv from 'dotenv';

dotenv.config();
neonConfig.webSocketConstructor = ws;

async function diagnose() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL not found");

    const adapter = new PrismaNeon({ connectionString });
    const prisma = new PrismaClient({ adapter });

    try {
        const tables = ['User', 'Account', 'Session', 'Verification'];
        
        for (const table of tables) {
            console.log(`\n🔍 Checking '${table}' table columns...`);
            const columns: any[] = await prisma.$queryRawUnsafe(`
                SELECT column_name::text, data_type::text 
                FROM information_schema.columns 
                WHERE table_name = '${table}';
            `);
            
            if (columns.length === 0) {
                console.log(`⚠️ TABLE '${table}' NOT FOUND OR EMPTY!`);
                continue;
            }

            columns.forEach(c => console.log(` - ${c.column_name} (${c.data_type})`));
        }

    } catch (err: any) {
        console.error("❌ Diagnostic failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

diagnose();
