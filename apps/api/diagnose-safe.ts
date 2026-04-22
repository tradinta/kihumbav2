// Safer Database Diagnostic
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
        console.log("🔍 Checking 'User' table columns (safe cast)...");
        // We cast column_name and data_type to TEXT to avoid Prisma deserialization errors with PG internal types
        const userColumns: any[] = await prisma.$queryRawUnsafe(`
            SELECT column_name::text, data_type::text 
            FROM information_schema.columns 
            WHERE table_name = 'User';
        `);
        
        console.log("Actual Columns in DB:");
        userColumns.forEach(c => console.log(` - ${c.column_name} (${c.data_type})`));

        // Required for Better Auth v1
        const required = ['id', 'name', 'email', 'emailVerified', 'image', 'createdAt', 'updatedAt'];
        const missing = required.filter(r => !userColumns.some(c => c.column_name === r));
        
        if (missing.length > 0) {
            console.log("\n⚠️ MISSING REQUIRED COLUMNS:", missing);
        } else {
            console.log("\n✅ All core Better Auth columns found.");
        }

    } catch (err: any) {
        console.error("❌ Safe Diagnostic failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

diagnose();
