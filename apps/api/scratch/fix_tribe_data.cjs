const { neon } = require('@neondatabase/serverless');

const sql = neon("postgresql://neondb_owner:npg_EOeTwR8cL1GZ@ep-nameless-base-antq5xrs-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require");

async function fixData() {
    try {
        console.log('Connecting to Neon...');
        
        console.log('Migrating old categories to OTHER...');
        await sql`
            UPDATE "Tribe" 
            SET "category" = 'OTHER' 
            WHERE "category"::text NOT IN ('COMMUNITY', 'EDUCATION', 'PROFESSIONAL', 'GAMING', 'ENTERTAINMENT', 'BRAND', 'OTHER')
        `;
        
        console.log('Migration complete.');
        
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

fixData();
