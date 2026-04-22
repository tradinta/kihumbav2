const { neon } = require('@neondatabase/serverless');

const connectionString = "postgresql://neondb_owner:npg_EOeTwR8cL1GZ@ep-nameless-base-antq5xrs.c-6.us-east-1.aws.neon.tech:5432/neondb?sslmode=require";

async function auditPostTable() {
  const sql = neon(connectionString);

  try {
    console.log('[AUDIT] Fetching Column Metadata for "Post" Table...');
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Post';
    `;
    
    console.log('[COLUMNS] Current Post Architecture:');
    columns.forEach(c => console.log(` - ${c.column_name} (${c.data_type})`));

    console.log('\n[AUDIT] Checking existence of "Tribe" and "Video" tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    console.log('[TABLES] Current Database Pulse:');
    tables.forEach(t => console.log(` - ${t.table_name}`));

  } catch (err) {
    console.error('[ERROR] Audit Failed:', err.message);
  }
}

auditPostTable();
