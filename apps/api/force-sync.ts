// Force Sync & Isolate Script
import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import * as dotenv from 'dotenv';

dotenv.config();
neonConfig.webSocketConstructor = ws;

async function run() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL not found");

    const adapter = new PrismaNeon({ connectionString });
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("🛠️  Step 1: Raw SQL Column Reconstruction...");
        
        // This command ensures every column is present and correctly typed.
        // We use SERIAL for numericId to handle auto-increment.
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT false;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "image" TEXT;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phoneNumber" TEXT;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phoneNumberVerified" BOOLEAN DEFAULT false;
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "numericId" INTEGER; -- Manual int if Serial is failing
        `).catch(e => console.log("⚠️ SQL Warning:", e.message));

        console.log("🛠️  Step 2: Testing Prisma Creation...");
        // Try creating a test user to see if PRISMA errors out
        const testEmail = `test-${Date.now()}@kihumba.com`;
        
        try {
            const user = await prisma.user.create({
                data: {
                    email: testEmail,
                    // We DO NOT provide numericId here, Prisma should handle autoincrement
                }
            });
            console.log("✅ Prisma Success! Created user:", user.id);
            // Cleanup
            await prisma.user.delete({ where: { id: user.id } });
        } catch (err: any) {
            console.error("❌ Prisma FAILED directly:", err.message);
            if (err.code === 'P2022') {
                console.error("DEBUG: Prisma is still missing a column in the model it's trying to use.");
            }
        }

    } catch (err: any) {
        console.error("❌ System failure:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

run();
