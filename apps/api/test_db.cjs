const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Database Pulse Check ---');
  try {
    const users = await prisma.user.findMany({ take: 1 });
    console.log('SUCCESS: Connection Bridge Active');
    console.log('Users found:', users.length);
  } catch (err) {
    console.error('FAILURE: Connection Handshake Failed');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
