import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPrivacy(username: string) {
  console.log(`\n🔍 Inspecting Privacy for: ${username}`);
  
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      fullName: true,
      privateAccount: true,
      searchEngineIndexing: true
    }
  });

  if (!user) {
    console.log('❌ User not found');
    return;
  }

  console.log('--- Current Settings ---');
  console.log(`Private Account: ${user.privateAccount}`);
  console.log(`Search Indexing: ${user.searchEngineIndexing}`);

  // Simulate Guest View (Search Indexing OFF logic)
  if (!user.searchEngineIndexing) {
    console.log('\n🎭 [GUEST VIEW - MASKED]');
    console.log('Username: kihumba-user');
    console.log('Full Name: Private Identity');
  } else {
    console.log('\n🌍 [GUEST VIEW - PUBLIC]');
    console.log(`Username: ${user.username}`);
    console.log(`Full Name: ${user.fullName}`);
  }

  // Simulate Mutual Friend Logic
  const friendId = 'simulated-friend-id';
  console.log('\n🔒 [ACCESS CONTROL]');
  if (user.privateAccount) {
    console.log('Result: Content is RESTRICTED (Mutual Friends Only)');
  } else {
    console.log('Result: Content is PUBLIC');
  }
}

const target = process.argv[2];
if (!target) {
  console.log('Usage: npx ts-node check-privacy.ts <username>');
  process.exit(1);
}

checkPrivacy(target).then(() => prisma.$disconnect());
