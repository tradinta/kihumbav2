import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

function loadEnv() {
    dotenv.config({ path: join(__dirname, '../.env') });
    dotenv.config({ path: join(__dirname, '../../../../.env') });
}

loadEnv();

function getCleanDatabaseUrl(): string {
    const rawUrl = process.env.DATABASE_URL || '';
    return rawUrl.trim().replace(/^["']|["']$/g, '').trim();
}

const connectionString = getCleanDatabaseUrl();
let prisma: PrismaClient;

if (connectionString.includes('neon.tech')) {
    const adapter = new PrismaNeon({ connectionString });
    prisma = new PrismaClient({ adapter });
} else {
    prisma = new PrismaClient();
}

async function main() {
  const videos = await prisma.video.findMany({
    where: {
      deletedAt: null,
      status: 'ready',
    },
    select: {
      id: true,
      title: true,
      duration: true,
      isSpark: true,
    }
  });

  console.log('--- Video Sync Audit ---');
  let fixedCount = 0;

  for (const video of videos) {
    const shouldBeSpark = video.duration && video.duration < 151;
    if (video.isSpark !== shouldBeSpark) {
      console.log(`[FIX] Video "${video.title}" (ID: ${video.id})`);
      console.log(`      Duration: ${video.duration}s | Current isSpark: ${video.isSpark} | Should be: ${shouldBeSpark}`);
      
      await prisma.video.update({
        where: { id: video.id },
        data: { isSpark: !!shouldBeSpark }
      });
      fixedCount++;
    }
  }

  console.log(`--- Sync Complete. Fixed ${fixedCount} videos. ---`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
