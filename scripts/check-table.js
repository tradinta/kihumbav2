
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: 'apps/api/.env' });

async function checkTable() {
    const sql = neon(process.env.DATABASE_URL);
    try {
        console.log('🔍 CHECKING TWOFACTOR TABLE COLUMNS...');
        const columns = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'TwoFactor'
        `;
        console.table(columns);
    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

checkTable();
