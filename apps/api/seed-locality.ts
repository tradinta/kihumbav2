import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// Polyfill for Neon WebSocket connection
neonConfig.webSocketConstructor = ws;

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const rawUrl = process.env.DATABASE_URL || '';
const connectionString = rawUrl.trim().replace(/^["']|["']$/g, '').trim();

let prisma: PrismaClient;

if (connectionString.includes('neon.tech')) {
    const adapter = new PrismaNeon({ connectionString });
    prisma = new PrismaClient({ adapter });
} else {
    prisma = new PrismaClient();
}

async function main() {
    console.log("🚀 Starting Locality Seeding...");

    const fullDataPath = 'C:\\Users\\My PC\\Desktop\\Personal Projects\\Kenya\\kenya_full.json';
    const instDataPath = 'C:\\Users\\My PC\\Desktop\\Personal Projects\\Kenya\\kenya_institutions.json';

    if (!fs.existsSync(fullDataPath) || !fs.existsSync(instDataPath)) {
        console.error("❌ Data files not found in C:\\Users\\My PC\\Desktop\\Personal Projects\\Kenya");
        return;
    }

    const fullData = JSON.parse(fs.readFileSync(fullDataPath, 'utf8'));
    const institutionData = JSON.parse(fs.readFileSync(instDataPath, 'utf8'));

    const counties = fullData.counties;
    const institutions = institutionData.institutions;

    for (const [id, county] of Object.entries<any>(counties)) {
        const countyName = county.name;
        // Create a clean username for the county
        const countyUsername = `${countyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_gov`;
        
        console.log(`\n📍 Processing [${id}] ${countyName}...`);

        // 1. Create/Update County Government Account
        await prisma.user.upsert({
            where: { username: countyUsername },
            update: {
                // @ts-ignore
                accountType: 'GOVERNMENT',
                // @ts-ignore
                isReserved: true,
                county: countyName,
                // @ts-ignore
                countyId: parseInt(id),
                isVerified: true,
            },
            create: {
                username: countyUsername,
                email: `contact@${countyUsername}.kihumba.gov`,
                name: `${countyName} County Government`,
                // @ts-ignore
                accountType: 'GOVERNMENT',
                // @ts-ignore
                isReserved: true,
                county: countyName,
                // @ts-ignore
                countyId: parseInt(id),
                isVerified: true,
            }
        });

        // 2. Process Institutions for this county
        const countyInstitutions = institutions[id];
        if (countyInstitutions) {
            const allSchools = [
                ...(countyInstitutions.universities || []), 
                ...(countyInstitutions.tvets || [])
            ];

            for (const school of allSchools) {
                // Generate a clean institution username
                const schoolUsername = school.toLowerCase()
                    .replace(/\([^)]*\)/g, '') // remove parentheses text
                    .replace(/[^a-z0-9]+/g, '_') // underscores for symbols
                    .replace(/^_+|_+$/g, ''); // trim underscores

                console.log(`  - 🎓 Seeding: ${school}`);

                await prisma.user.upsert({
                    where: { username: schoolUsername },
                    update: {
                        // @ts-ignore
                        accountType: 'GOVERNMENT',
                        // @ts-ignore
                        isReserved: true,
                        county: countyName,
                        // @ts-ignore
                        countyId: parseInt(id),
                        // @ts-ignore
                        institution: school,
                        isVerified: true,
                    },
                    create: {
                        username: schoolUsername,
                        email: `official@${schoolUsername}.kihumba.edu`,
                        name: school,
                        // @ts-ignore
                        accountType: 'GOVERNMENT',
                        // @ts-ignore
                        isReserved: true,
                        county: countyName,
                        // @ts-ignore
                        countyId: parseInt(id),
                        // @ts-ignore
                        institution: school,
                        isVerified: true,
                    }
                });
            }
        }
    }

    console.log("\n✅ Seeding Complete. All Counties and Institutions are now Reserved Government Accounts.");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
