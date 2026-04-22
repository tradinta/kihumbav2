// Database Diagnostic Script
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
        console.log("🔍 Checking 'User' table columns...");
        const userColumns = await prisma.$queryRawUnsafe(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'User';
        `);
        console.log("User Columns:", JSON.stringify(userColumns, null, 2));

        console.log("\n🔍 Checking 'Session' table columns...");
        const sessionColumns = await prisma.$queryRawUnsafe(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'Session';
        `);
        console.log("Session Columns:", JSON.stringify(sessionColumns, null, 2));

        console.log("\n🔍 Checking 'Account' table columns...");
        const accountColumns = await prisma.$queryRawUnsafe(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'Account';
        `);
        console.log("Account Columns:", JSON.stringify(accountColumns, null, 2));

    } catch (err: any) {
        console.error("❌ Diagnostic failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

diagnose();
