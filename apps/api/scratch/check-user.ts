
import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import * as dotenv from 'dotenv';

dotenv.config();
neonConfig.webSocketConstructor = ws;

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return;
  const adapter = new PrismaNeon(new (require('@neondatabase/serverless').Pool)({ connectionString }));
  const prisma = new PrismaClient({ adapter });

  try {
    const users = await prisma.user.findMany({ take: 5 });
    console.log('USERS:', JSON.stringify(users, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}
run();
