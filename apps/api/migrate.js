const { Client, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Local env loader
function loadEnv() {
    // 1. Same directory (apps/api/.env)
    dotenv.config({ path: path.join(__dirname, '.env') });
    // 2. Monorepo root (.env)
    dotenv.config({ path: path.join(__dirname, '../../.env') });
}

function getCleanDatabaseUrl() {
    const rawUrl = process.env.DATABASE_URL || '';
    return rawUrl.trim().replace(/^["']|["']$/g, '').trim();
}

loadEnv();
neonConfig.webSocketConstructor = ws;

async function runMigration() {
    const connectionString = getCleanDatabaseUrl();

    if (!connectionString) {
        throw new Error('DATABASE_URL is not defined in .env');
    }

    console.log('🔗 Connecting to Neon via WebSockets...');
    const client = new Client({ connectionString });
    await client.connect();

    console.log('📖 Reading SQL schema from prisma/init.sql...');
    const sqlPath = path.join(__dirname, 'prisma', 'init.sql');
    if (!fs.existsSync(sqlPath)) {
        throw new Error(`init.sql not found at ${sqlPath}`);
    }
    let sql = fs.readFileSync(sqlPath, 'utf8');

    // SURGICAL FIX: Strip Unicode BOM if present
    if (sql.charCodeAt(0) === 0xFEFF) {
        console.log('🧹 Stripping BOM character...');
        sql = sql.slice(1);
    }

    console.log('🚀 Executing schema synchronization...');
    
    // We wrap everything in a transaction if possible, or execute carefully.
    // For a forced sync, we can prepend drops or just execute the raw SQL.
    // Since init.sql was generated with --from-empty, we should really ensure tables are clean.
    
    try {
        console.log('🧨 Performing Nuclear Reset (Wiping public schema)...');
        await client.query('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
        await client.query('GRANT ALL ON SCHEMA public TO public;'); // Ensure permissions
        
        // Split by statement (rudimentary split, but works for Prisma generated SQL)
        const statements = sql.split(';').filter(s => s.trim().length > 0);
        
        console.log(`🚀 Executing ${statements.length} statements...`);
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i].trim();
            if (!statement) continue;
            
            try {
                await client.query(statement + ';');
                if (i % 20 === 0) process.stdout.write('.');
            } catch (stmtErr) {
                console.error(`\n❌ Error at statement ${i}: ${statement.substring(0, 50)}...`);
                throw stmtErr;
            }
        }
        
        console.log('\n✅ Success! The Neon Database schema is fully synchronized.');
    } catch (err) {
        console.error('\n❌ Reset Failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runMigration().catch(err => {
    console.error('Migration Failed:', err);
    process.exit(1);
});
