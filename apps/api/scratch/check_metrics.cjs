const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const interactions = await prisma.userInteraction.count();
  const posts = await prisma.post.count();
  const videos = await prisma.video.count();
  
  console.log('--- Platform Heartbeat ---');
  console.log('Total Interactions:', interactions);
  console.log('Total Posts:', posts);
  console.log('Total Videos:', videos);
  
  const topPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, contentType: true, _count: { select: { interactions: true } } }
  });
  
  console.log('\nTop Posts Metrics:');
  console.table(topPosts.map(p => ({ id: p.id, type: p.contentType, likes: p._count.interactions })));
  
  process.exit(0);
}

check();
