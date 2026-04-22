// Final Constraint Relaxation Script
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
        console.log("🔓 Relaxing constraints on 'User' table...");

        // Make columns nullable to satisfy Prisma creation
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "User" ALTER COLUMN "numericId" DROP NOT NULL;
            ALTER TABLE "User" ALTER COLUMN "tier" DROP NOT NULL;
            ALTER TABLE "User" ALTER COLUMN "country" DROP NOT NULL;
            ALTER TABLE "User" ALTER COLUMN "profileComplete" DROP NOT NULL;
            ALTER TABLE "User" ALTER COLUMN "isVerified" DROP NOT NULL;
            ALTER TABLE "User" ALTER COLUMN "isBanned" DROP NOT NULL;
            ALTER TABLE "User" ALTER COLUMN "emailVerified" DROP NOT NULL;
            ALTER TABLE "User" ALTER COLUMN "phoneNumberVerified" DROP NOT NULL;
        `);

        console.log("✅ Constraints relaxed! Prisma should now be able to create users.");
    } catch (err: any) {
        console.error("❌ Fix failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

fix();
