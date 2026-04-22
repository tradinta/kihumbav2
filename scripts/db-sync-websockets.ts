import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load env from apps/api/.env
dotenv.config({ path: resolve(__dirname, '../apps/api/.env') });

async function sync() {
    const sql = neon(process.env.DATABASE_URL!);

    console.log('🚀 Starting WebSocket-based Database Sync...');

    try {
        // 1. Create Enum if it doesn't exist
        console.log('Checking InteractionType enum...');
        await sql(`
            DO $$ BEGIN
                CREATE TYPE "InteractionType" AS ENUM ('UPVOTE', 'DOWNVOTE', 'VIEW', 'SHARE', 'BOOKMARK', 'RESHARE');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        // 2. Create UserInteraction Table if it doesn't exist
        console.log('Checking UserInteraction table...');
        await sql(`
            CREATE TABLE IF NOT EXISTS "UserInteraction" (
                "id" TEXT NOT NULL,
                "type" "InteractionType" NOT NULL,
                "userId" TEXT NOT NULL,
                "postId" TEXT,
                "commentId" TEXT,
                "videoId" TEXT,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "UserInteraction_pkey" PRIMARY KEY ("id")
            );
        `);

        // 3. Create Indexes
        console.log('Ensuring indexes...');
        await sql('CREATE UNIQUE INDEX IF NOT EXISTS "UserInteraction_userId_postId_type_key" ON "UserInteraction"("userId", "postId", "type");');
        await sql('CREATE INDEX IF NOT EXISTS "UserInteraction_userId_idx" ON "UserInteraction"("userId");');
        await sql('CREATE INDEX IF NOT EXISTS "UserInteraction_postId_idx" ON "UserInteraction"("postId");');

        console.log('✅ Sync Completed Successfully!');
    } catch (error) {
        console.error('❌ Sync Failed:', error);
    }
}

sync();
