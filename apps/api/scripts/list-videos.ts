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
    select: {
      id: true,
      title: true,
      duration: true,
      isSpark: true,
      status: true,
      deletedAt: true
    }
  });

  console.log(JSON.stringify(videos, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
