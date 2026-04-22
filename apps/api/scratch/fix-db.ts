
import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import * as dotenv from 'dotenv';

dotenv.config();

neonConfig.webSocketConstructor = ws;

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');

  const pool = new PrismaNeon(new (require('@neondatabase/serverless').Pool)({ connectionString }));
  const prisma = new PrismaClient({ adapter: pool });

  try {
    console.log('Adding twoFactorEnabled column to User table...');
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN DEFAULT false;`);
    console.log('Success!');
  } catch (err) {
    console.error('Failed to add column:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
