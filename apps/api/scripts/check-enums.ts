import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkEnums() {
    const sql = neon(process.env.DATABASE_URL!.replace('-pooler', ''));
    
    try {
        console.log('🔍 Checking for existing enums...');
        const enums = await sql`SELECT typname FROM pg_type WHERE typcategory = 'E';`;
        console.log('📊 Enums found:', enums.map(e => e.typname).join(', '));
    } catch (error) {
        console.error('❌ Error checking enums:', error);
    }
}

checkEnums();
