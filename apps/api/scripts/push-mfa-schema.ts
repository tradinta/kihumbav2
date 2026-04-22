import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'apps/api/.env' });

neonConfig.webSocketConstructor = ws;

async function pushMfaSchema() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL not found");

    const adapter = new PrismaNeon({ connectionString });
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("🛠️ Pushing MFA and Passkey schema changes via HTTP...");
        
        await prisma.$executeRawUnsafe(`
            -- Create TwoFactor table
            CREATE TABLE IF NOT EXISTS "TwoFactor" (
                "id" TEXT NOT NULL,
                "secret" TEXT NOT NULL,
                "backupCodes" TEXT NOT NULL,
                "userId" TEXT NOT NULL,

                CONSTRAINT "TwoFactor_pkey" PRIMARY KEY ("id")
            );

            -- Create Passkey table
            CREATE TABLE IF NOT EXISTS "Passkey" (
                "id" TEXT NOT NULL,
                "name" TEXT,
                "publicKey" TEXT NOT NULL,
                "userId" TEXT NOT NULL,
                "credentialID" TEXT NOT NULL,
                "counter" INTEGER NOT NULL,
                "deviceType" TEXT NOT NULL,
                "backedUp" BOOLEAN NOT NULL,
                "transports" TEXT,
                "createdAt" TIMESTAMP(3),

                CONSTRAINT "Passkey_pkey" PRIMARY KEY ("id")
            );

            -- Add Indexes
            CREATE INDEX IF NOT EXISTS "TwoFactor_userId_idx" ON "TwoFactor"("userId");
            CREATE INDEX IF NOT EXISTS "Passkey_userId_idx" ON "Passkey"("userId");

            -- Add Foreign Keys (using DO block to avoid errors if they already exist)
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'TwoFactor_userId_fkey') THEN
                    ALTER TABLE "TwoFactor" ADD CONSTRAINT "TwoFactor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Passkey_userId_fkey') THEN
                    ALTER TABLE "Passkey" ADD CONSTRAINT "Passkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
                END IF;
            END $$;
        `);

        console.log("✅ MFA and Passkey tables established successfully!");

    } catch (err: any) {
      if (err.message.includes('already exists')) {
        console.log("ℹ️ Tables or indexes already exist. Skipping creation.");
      } else {
        console.error("❌ Schema push failed:", err.message);
      }
    } finally {
        await prisma.$disconnect();
    }
}

pushMfaSchema();
