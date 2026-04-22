const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
const Mux = require('@mux/mux-node');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const connectionString = (process.env.DATABASE_URL || '').trim().replace(/^["']|["']$/g, '').trim();
neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

async function main() {
  console.log('--- High-Fidelity Mux Status Sync Starting (WebSocket Mode) ---');
  
  try {
    const pendingVideos = await prisma.video.findMany({
      where: { status: 'uploading', deletedAt: null }
    });

    console.log(`Found ${pendingVideos.length} pending uploads in local archives.`);

    for (const video of pendingVideos) {
      if (!video.uploadId) continue;

      console.log(`Auditing Mux status for Upload ID: ${video.uploadId}...`);
      
      try {
        const upload = await mux.video.uploads.retrieve(video.uploadId);
        console.log(`Mux Upload Status: ${upload.status}`);
        
        if ((upload.status === 'completed' || upload.status === 'asset_created') && upload.asset_id) {
          console.log(`Upload successful! Retrieving Asset: ${upload.asset_id}...`);
          const asset = await mux.video.assets.retrieve(upload.asset_id);
          console.log(`Mux Asset Status: ${asset.status}`);
          
          if (asset.status === 'ready') {
            const playbackId = asset.playback_ids?.[0]?.id;
            const duration = asset.duration;
            
            console.log(`SUCCESS: Asset ready! Duration: ${duration}s, Playback ID: ${playbackId}`);

            await prisma.video.update({
              where: { id: video.id },
              data: {
                assetId: asset.id,
                playbackId: playbackId,
                duration: duration,
                status: 'ready',
                isSpark: duration < 151
              }
            });
            
            console.log(`Synchronized Video Record: ${video.id}`);
          }
        }
      } catch (err) {
        console.error(`Handshake failure for Upload ${video.uploadId}:`, err.message);
      }
    }

    console.log('--- Mux Status Sync Pulse Complete ---');

  } catch (err) {
    console.error('CRITICAL SECTOR FAILURE: Mux Sync failed');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
