const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables directly from the api folder
dotenv.config({ path: path.join(__dirname, '../apps/api/.env') });

async function forceSync() {
    const rawUrl = process.env.DATABASE_URL;
    if (!rawUrl) {
        console.error('❌ DATABASE_URL not found in .env');
        return;
    }

    // Convert any postgres:// URL to a format the HTTP driver likes
    // Removing the -pooler and port 6543 often helps with the HTTP interface
    const httpUrl = rawUrl.replace('-pooler', '').replace(':6543', '').replace(':5432', '');
    
    console.log('🚀 Attempting HTTP-based Force Sync...');
    console.log(`🔗 Target Host: ${new URL(httpUrl).hostname}`);

    const sql = neon(httpUrl);

    try {
        // 1. Create the Enum
        console.log('📦 Ensuring InteractionType enum...');
        await sql`
            DO $$ BEGIN
                CREATE TYPE "InteractionType" AS ENUM ('UPVOTE', 'DOWNVOTE', 'VIEW', 'SHARE', 'BOOKMARK', 'RESHARE');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `;

        // 2. Create the Table UserInteraction
        console.log('🗄️ Ensuring UserInteraction table...');
        await sql`
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
        `;

        // 3. Create Indexes for UserInteraction
        console.log('⚡ Ensuring UserInteraction indexes...');
        await sql`CREATE UNIQUE INDEX IF NOT EXISTS "UserInteraction_userId_postId_type_key" ON "UserInteraction"("userId", "postId", "type");`;
        await sql`CREATE INDEX IF NOT EXISTS "UserInteraction_userId_idx" ON "UserInteraction"("userId");`;
        await sql`CREATE INDEX IF NOT EXISTS "UserInteraction_postId_idx" ON "UserInteraction"("postId");`;

        // 4. Update Fire Table (Add viewCount if missing)
        console.log('🔥 Bolstering Fire (Stories) table...');
        await sql`
            DO $$ BEGIN
                ALTER TABLE "Fire" ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0;
            EXCEPTION
                WHEN duplicate_column THEN null;
                WHEN undefined_table THEN
                    CREATE TABLE "Fire" (
                        "id" TEXT NOT NULL,
                        "mediaUrl" TEXT,
                        "content" TEXT,
                        "expiresAt" TIMESTAMP(3) NOT NULL,
                        "authorId" TEXT NOT NULL,
                        "viewCount" INTEGER NOT NULL DEFAULT 0,
                        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT "Fire_pkey" PRIMARY KEY ("id")
                    );
            END $$;
        `;

        // 6. Create FireView Table
        console.log('👀 Creating FireView table...');
        await sql`
            CREATE TABLE IF NOT EXISTS "FireView" (
                "id" TEXT NOT NULL,
                "fireId" TEXT NOT NULL,
                "viewerId" TEXT NOT NULL,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "FireView_pkey" PRIMARY KEY ("id"),
                CONSTRAINT "FireView_fireId_fkey" FOREIGN KEY ("fireId") REFERENCES "Fire"("id") ON DELETE CASCADE,
                CONSTRAINT "FireView_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "User"("id") ON DELETE CASCADE
            );
        `;

        console.log('⚡ Ensuring FireView indexes...');
        await sql`CREATE UNIQUE INDEX IF NOT EXISTS "FireView_fireId_viewerId_key" ON "FireView"("fireId", "viewerId");`;
        await sql`CREATE INDEX IF NOT EXISTS "FireView_fireId_idx" ON "FireView"("fireId");`;

        // 7. Update User Table (Add Registration tracking)
        console.log('👤 Bolstering User table for security tracking...');
        await sql`
            DO $$ BEGIN
                ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "registrationIp" TEXT;
                ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "registrationDevice" TEXT;
                ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT false;
                ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phoneNumberVerified" BOOLEAN DEFAULT false;
            EXCEPTION
                WHEN undefined_table THEN null;
            END $$;
        `;

        // 8. Ensure Better Auth Tables
        console.log('🛡️ Ensuring Better Auth core tables...');
        await sql`
            CREATE TABLE IF NOT EXISTS "Session" (
                "id" TEXT NOT NULL,
                "userId" TEXT NOT NULL,
                "expiresAt" TIMESTAMP(3) NOT NULL,
                "token" TEXT NOT NULL,
                "ipAddress" TEXT,
                "userAgent" TEXT,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,
                CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
            )
        `;
        await sql`CREATE UNIQUE INDEX IF NOT EXISTS "Session_token_key" ON "Session"("token")`;

        await sql`
            CREATE TABLE IF NOT EXISTS "Account" (
                "id" TEXT NOT NULL,
                "userId" TEXT NOT NULL,
                "accountId" TEXT NOT NULL,
                "providerId" TEXT NOT NULL,
                "accessToken" TEXT,
                "refreshToken" TEXT,
                "accessTokenExpiresAt" TIMESTAMP(3),
                "refreshTokenExpiresAt" TIMESTAMP(3),
                "scope" TEXT,
                "idToken" TEXT,
                "password" TEXT,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,
                CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
            )
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS "Verification" (
                "id" TEXT NOT NULL,
                "identifier" TEXT NOT NULL,
                "value" TEXT NOT NULL,
                "expiresAt" TIMESTAMP(3) NOT NULL,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,
                CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
            )
        `;

        console.log('🔑 Ensuring Advanced Auth tables (MFA, Passkeys, Audit)...');
        await sql`
            CREATE TABLE IF NOT EXISTS "TwoFactor" (
                "id" TEXT NOT NULL,
                "secret" TEXT NOT NULL,
                "backupCodes" TEXT NOT NULL,
                "userId" TEXT NOT NULL,
                "verified" BOOLEAN NOT NULL DEFAULT FALSE,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,
                CONSTRAINT "TwoFactor_pkey" PRIMARY KEY ("id")
            )
        `;
        await sql`
            DO $$ BEGIN
                ALTER TABLE "TwoFactor" ADD COLUMN IF NOT EXISTS "verified" BOOLEAN NOT NULL DEFAULT FALSE;
            EXCEPTION
                WHEN undefined_table THEN null;
            END $$;
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS "Passkey" (
                "id" TEXT NOT NULL,
                "name" TEXT,
                "publicKey" TEXT NOT NULL,
                "counter" INTEGER NOT NULL,
                "deviceType" TEXT NOT NULL,
                "backedUp" BOOLEAN NOT NULL,
                "transports" TEXT,
                "aaguid" TEXT,
                "userId" TEXT NOT NULL,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "Passkey_pkey" PRIMARY KEY ("id")
            )
        `;
        await sql`
            DO $$ BEGIN
                ALTER TABLE "Passkey" ADD COLUMN IF NOT EXISTS "aaguid" TEXT;
            EXCEPTION
                WHEN undefined_table THEN null;
            END $$;
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS "SecurityAuditLog" (
                "id" TEXT NOT NULL,
                "userId" TEXT NOT NULL,
                "event" TEXT NOT NULL,
                "oldValue" TEXT,
                "newValue" TEXT,
                "ipAddress" TEXT,
                "userAgent" TEXT,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "SecurityAuditLog_pkey" PRIMARY KEY ("id")
            )
        `;
        await sql`CREATE INDEX IF NOT EXISTS "SecurityAuditLog_userId_idx" ON "SecurityAuditLog"("userId")`;

        console.log('📬 Bolstering Messaging Infrastructure...');
        // 9. Add isArchived to Participant
        await sql`
            DO $$ BEGIN
                ALTER TABLE "Participant" ADD COLUMN IF NOT EXISTS "isArchived" BOOLEAN NOT NULL DEFAULT FALSE;
            EXCEPTION
                WHEN undefined_table THEN null;
            END $$;
        `;

        // 10. Create MessagingSettings Table
        await sql`
            CREATE TABLE IF NOT EXISTS "MessagingSettings" (
                "userId" TEXT NOT NULL,
                "keepArchived" BOOLEAN NOT NULL DEFAULT TRUE,
                "readReceipts" BOOLEAN NOT NULL DEFAULT TRUE,
                "showOnlineStatus" BOOLEAN NOT NULL DEFAULT TRUE,
                "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "MessagingSettings_pkey" PRIMARY KEY ("userId"),
                CONSTRAINT "MessagingSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
            )
        `;

        console.log('✅ Success! Database bolstered over HTTP.');

    } catch (error) {
        console.error('❌ HTTP Sync Failed:', error.message);
        if (error.hint) console.error('💡 Hint:', error.hint);
    }
}

forceSync();
