import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkMarket() {
    const sql = neon(process.env.DATABASE_URL!.replace('-pooler', ''));
    
    try {
        console.log('🔍 Checking MarketListing table structure...');
        const columns = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'MarketListing';`;
        console.log('📊 Columns found:', columns.map(c => c.column_name).join(', '));
    } catch (error) {
        console.error('❌ Error checking table:', error);
    }
}

checkMarket();
