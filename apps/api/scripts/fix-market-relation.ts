import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

async function fixSchema() {
    const sql = neon(process.env.DATABASE_URL!.replace('-pooler', ''));
    
    console.log('🚀 Altering Post table to add marketListingId...');
    
    try {
        // 1. Add the column
        await sql`ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "marketListingId" TEXT;`;
        console.log('✅ Added marketListingId column.');

        // 2. Add foreign key constraint
        // Note: PostgreSql doesn't support IF NOT EXISTS for ADD CONSTRAINT directly in some versions easily, 
        // so we check if it exists or just try/catch
        try {
            await sql`
                ALTER TABLE "Post" 
                ADD CONSTRAINT "Post_marketListingId_fkey" 
                FOREIGN KEY ("marketListingId") 
                REFERENCES "MarketListing"("id") 
                ON DELETE SET NULL ON UPDATE CASCADE;
            `;
            console.log('✅ Added foreign key constraint.');
        } catch (e) {
            console.log('⚠️ Constraint might already exist, skipping...');
        }

    } catch (error) {
        console.error('❌ Failed to alter table:', error);
    }
}

fixSchema();
