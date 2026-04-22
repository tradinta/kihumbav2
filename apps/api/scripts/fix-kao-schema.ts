import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

async function fixKaoSchema() {
    const sql = neon(process.env.DATABASE_URL!.replace('-pooler', ''));
    
    console.log('🚀 Synchronizing KaoListing table schema...');
    
    try {
        // 1. Rename tags to amenities if amenities doesn't exist
        try {
            await sql`ALTER TABLE "KaoListing" RENAME COLUMN "tags" TO "amenities";`;
            console.log('✅ Renamed tags to amenities.');
        } catch (e) {
            console.log('⚠️ Could not rename tags (maybe amenities already exists or tags is missing).');
        }

        // 2. Add missing columns
        const columnsToAdd = [
            { name: 'deposit', type: 'DOUBLE PRECISION' },
            { name: 'rentDeadline', type: 'TEXT' },
            { name: 'hasDeposit', type: 'BOOLEAN', default: 'false' },
            { name: 'depositAmount', type: 'DOUBLE PRECISION' },
            { name: 'serviceCharge', type: 'DOUBLE PRECISION' },
            { name: 'electricityType', type: '"UtilityType"', default: "'TOKEN'" },
            { name: 'waterType', type: '"UtilityType"', default: "'INCLUDED'" },
            { name: 'safetyScore', type: 'INTEGER', default: '5' },
            { name: 'friendlinessScore', type: 'INTEGER', default: '5' },
            { name: 'proximityScore', type: 'INTEGER', default: '5' },
            { name: 'proximityDetails', type: 'TEXT' },
            { name: 'isIndividual', type: 'BOOLEAN', default: 'true' },
            { name: 'amenities', type: 'TEXT[]' } // In case rename failed
        ];

        for (const col of columnsToAdd) {
            try {
                const query = `ALTER TABLE "KaoListing" ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type} ${col.default ? `DEFAULT ${col.default}` : ''};`;
                await sql.query(query);
                console.log(`✅ Checked/Added column: ${col.name}`);
            } catch (e) {
                console.error(`❌ Failed to add column ${col.name}:`, e);
            }
        }

    } catch (error) {
        console.error('❌ Failed to synchronize KaoListing:', error);
    }
}

fixKaoSchema();
