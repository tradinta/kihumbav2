const { neon } = require('@neondatabase/serverless');

const connectionString = "postgresql://neondb_owner:npg_EOeTwR8cL1GZ@ep-nameless-base-antq5xrs.c-6.us-east-1.aws.neon.tech:5432/neondb?sslmode=require";

async function auditSocialSchema() {
  const sql = neon(connectionString);

  try {
    console.log('[AUDIT] Fetching social coordinates (Post, Video)...');
    
    const postColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Post';
    `;

    const videoColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Video';
    `;
    
    console.log('[POST] Columns:', postColumns.map(c => `${c.column_name} (${c.data_type})`).join(', '));
    console.log('[VIDEO] Columns:', videoColumns.map(c => `${c.column_name} (${c.data_type})`).join(', '));

  } catch (err) {
    console.error('[ERROR] Audit Failed:', err.message);
  }
}

auditSocialSchema();
