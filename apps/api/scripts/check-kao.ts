import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkKao() {
    const sql = neon(process.env.DATABASE_URL!.replace('-pooler', ''));
    
    try {
        console.log('🔍 Checking if KaoListing table exists...');
        const result = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'KaoListing';`;
        
        if (result.length === 0) {
            console.log('❌ KaoListing table does NOT exist.');
        } else {
            console.log('✅ KaoListing table exists.');
            const columns = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'KaoListing';`;
            console.log('📊 Columns found:', columns.map(c => c.column_name).join(', '));
        }
    } catch (error) {
        console.error('❌ Error checking table:', error);
    }
}

checkKao();
