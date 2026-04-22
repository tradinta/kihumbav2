import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkAllTables() {
    const sql = neon(process.env.DATABASE_URL!.replace('-pooler', ''));
    
    try {
        console.log('🔍 Listing all tables in public schema...');
        const result = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`;
        console.log('📊 Tables found:', result.map(t => t.table_name).sort().join(', '));
    } catch (error) {
        console.error('❌ Error checking tables:', error);
    }
}

checkAllTables();
