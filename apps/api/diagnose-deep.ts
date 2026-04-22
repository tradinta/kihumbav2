// Enum & Default Diagnostic
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
        console.log("🔍 Checking USER-DEFINED types (Enums)...");
        const enums = await prisma.$queryRawUnsafe(`
            SELECT t.typname as enum_name, 
                   e.enumlabel as enum_value
            FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid
            ORDER BY enum_name, enum_value;
        `);
        console.log("Registered Enums:", JSON.stringify(enums, null, 2));

        console.log("\n🔍 Checking Column Details (Default, Nullable)...");
        const details = await prisma.$queryRawUnsafe(`
            SELECT column_name, column_default, is_nullable, data_type
            FROM information_schema.columns 
            WHERE table_name = 'User'
            ORDER BY column_name;
        `);
        console.log("Column Details:", JSON.stringify(details, null, 2));

    } catch (err: any) {
        console.error("❌ Diagnostic failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

diagnose();
