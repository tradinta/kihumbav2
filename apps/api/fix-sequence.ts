// Sequence & Serial Fix Script
import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import * as dotenv from 'dotenv';

dotenv.config();
neonConfig.webSocketConstructor = ws;

async function fix() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL not found");

    const adapter = new PrismaNeon({ connectionString });
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("🔍 Checking for sequences...");
        const sequences: any[] = await prisma.$queryRawUnsafe(`
            SELECT relname FROM pg_class WHERE relkind = 'S';
        `);
        console.log("Found Sequences:", JSON.stringify(sequences, null, 2));

        console.log("🛠️  Converting numericId to SERIAL (Real Autoincrement)...");
        // To convert an existing column to serial, we create a sequence and own it
        await prisma.$executeRawUnsafe(`
            CREATE SEQUENCE IF NOT EXISTS "User_numericId_seq";
            ALTER TABLE "User" ALTER COLUMN "numericId" SET DEFAULT nextval('User_numericId_seq');
            ALTER SEQUENCE "User_numericId_seq" OWNED BY "User"."numericId";
        `);

        console.log("✅ Sequence created and linked!");
    } catch (err: any) {
        console.error("❌ SQL Fix failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

fix();
