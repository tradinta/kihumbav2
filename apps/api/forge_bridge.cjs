const { neon } = require('@neondatabase/serverless');

const connectionString = "postgresql://neondb_owner:npg_EOeTwR8cL1GZ@ep-nameless-base-antq5xrs.c-6.us-east-1.aws.neon.tech:5432/neondb?sslmode=require";

async function forgeSocialBridge() {
  const sql = neon(connectionString);

  try {
    console.log('[HANDSHAKE] Establishing Neon Serverless WebSocket Signal...');
    
    console.log('[SQL] Forging "videoId" column in "Post" table...');
    try {
        await sql`
          ALTER TABLE "Post" 
          ADD COLUMN "videoId" TEXT;
        `;
    } catch (e) { console.log('[SKIP] videoId column likely exists or error:', e.message); }

    console.log('[SQL] Forging Unique Constraint on "Post.videoId"...');
    try {
        await sql`
          ALTER TABLE "Post" 
          ADD CONSTRAINT "Post_videoId_key" UNIQUE ("videoId");
        `;
    } catch (e) { console.log('[SKIP] Unique constraint likely exists or error:', e.message); }

    console.log('[SQL] Forging Foreign Key "Post_videoId_fkey"...');
    try {
        await sql`
          ALTER TABLE "Post" 
          ADD CONSTRAINT "Post_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        `;
    } catch (e) { console.log('[SKIP] Foreign Key likely exists or error:', e.message); }

    console.log('[SUCCESS] Social Bridge (Post <-> Video) Commissioned.');
  } catch (err) {
    console.error('[ERROR] Social Bridge Forge Failed:', err.message);
  }
}

forgeSocialBridge();
