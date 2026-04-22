const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../apps/api/.env') });

async function checkPasskeys() {
    const rawUrl = process.env.DATABASE_URL;
    const httpUrl = rawUrl.replace('-pooler', '').replace(':6543', '').replace(':5432', '');
    const sql = neon(httpUrl);

    try {
        const passkeys = await sql`SELECT * FROM "Passkey"`;
        console.log('📦 PASSKEYS IN DB:', JSON.stringify(passkeys, null, 2));
        
        const targetUser = await sql`SELECT id, email FROM "User" WHERE id = 'm0ZwvkB9U0zru8kFQR4R07CjSCKILNxR'`;
        console.log('👤 TARGET USER:', JSON.stringify(targetUser, null, 2));
    } catch (error) {
        console.error('❌ Failed to check passkeys:', error.message);
    }
}

checkPasskeys();
