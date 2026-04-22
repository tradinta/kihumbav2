const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('🏗️ Forging Marketplace Missions...');

  const brands = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: 'Safaricom' } },
        { name: { contains: 'Java' } },
        { name: { contains: 'Kihumba' } }
      ]
    }
  });

  if (brands.length === 0) {
    console.log('❌ No brands found to link missions to. Run seeding first.');
    return;
  }

  const brand = brands[0];

  const campaigns = [
    {
      title: 'Safaricom M-PESA Global Pulse',
      description: 'Create a 60-second Spark showing how M-PESA makes your lifestyle seamless. Focused on the new Global Global feature.',
      deliverables: ['1x Spark Video', '3x High-res frames'],
      budgetTotal: 150000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      brandId: brand.id
    },
    {
      title: 'Java House Morning Brew',
      description: 'Capture the essence of a Java breakfast. We want high-energy, cinematic coffee shots and community vibes.',
      deliverables: ['1x Cinematic Spark'],
      budgetTotal: 85000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      brandId: brand.id
    }
  ];

  for (const c of campaigns) {
    await prisma.campaign.create({ data: c });
  }

  console.log('✅ Industrial Missions Forge Complete.');
  await prisma.$disconnect();
}

seed();
