// Scrutiny Diagnostic
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
        console.log("🔍 Scrutinizing 'User' table structure...");
        
        // We look for duplicate names or case-sensitive variations
        const columns: any[] = await prisma.$queryRawUnsafe(`
            SELECT 
                column_name::text as name, 
                data_type::text as type,
                ordinal_position as pos,
                is_nullable::text as nullable
            FROM information_schema.columns 
            WHERE table_name = 'User'
            ORDER BY pos;
        `);
        
        console.log("📋 FULL COLUMN LIST:");
        columns.forEach(c => {
            console.log(`[#${c.pos}] "${c.name}" - ${c.type} (Nullable: ${c.nullable})`);
        });

        // Search for duplicates
        const names = columns.map(c => c.name.toLowerCase());
        const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
        
        if (duplicates.length > 0) {
            console.log("\n🚨 CRITICAL ERROR: Duplicate column names detected (case-insensitive):", [...new Set(duplicates)]);
        } else {
            console.log("\n✅ No duplicate column names detected.");
        }

    } catch (err: any) {
        console.error("❌ Scrutiny failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

diagnose();
