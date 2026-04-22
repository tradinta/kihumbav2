import { PrismaClient } from '@prisma/client';
import { algoliasearch } from 'algoliasearch';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

// Load env
dotenv.config({ path: join(__dirname, '../.env') });
dotenv.config({ path: join(__dirname, '../../../.env') });

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

const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.ALGOLIA_ADMIN_KEY!
);

async function sync() {
    console.log('🚀 Starting Algolia v5 Sync with Neon Adapter...');

    try {
        // 1. Fetch Posts
        const posts = await prisma.post.findMany({
            where: { isDeleted: false },
            include: {
                author: { select: { id: true, username: true, fullName: true, avatar: true } },
                video: { select: { title: true, isSpark: true, duration: true } },
                _count: { select: { interactions: { where: { type: 'UPVOTE' } }, comments: true } }
            }
        });

        console.log(`📊 Found ${posts.length} posts to sync.`);

        const postObjects = posts.map(post => ({
            objectID: post.id,
            content: post.content,
            contentType: post.contentType,
            createdAt: post.createdAt.getTime(),
            author: post.author,
            videoTitle: post.video?.title || '',
            isSpark: post.video?.isSpark || false,
            likes: post._count.interactions,
            comments: post._count.comments,
            viewCount: post.viewCount,
            tags: post.content.match(/#\w+/g) || []
        }));

        if (postObjects.length > 0) {
            await client.saveObjects({ 
                indexName: 'kihumba_posts', 
                objects: postObjects 
            });
            console.log(`✅ Indexed ${postObjects.length} posts.`);
        }

        // 2. Fetch Users
        const users = await prisma.user.findMany({
            select: { id: true, username: true, fullName: true, avatar: true, createdAt: true }
        });

        console.log(`📊 Found ${users.length} users to sync.`);

        const userObjects = users.map(user => ({
            objectID: user.id,
            username: user.username,
            fullName: user.fullName,
            avatar: user.avatar,
            createdAt: user.createdAt.getTime()
        }));

        if (userObjects.length > 0) {
            await client.saveObjects({ 
                indexName: 'kihumba_users', 
                objects: userObjects 
            });
            console.log(`✅ Indexed ${userObjects.length} users.`);
        }

        // 3. Configure Indices
        await client.setSettings({
            indexName: 'kihumba_posts',
            indexSettings: {
                searchableAttributes: ['content', 'videoTitle', 'author.username', 'author.fullName', 'tags'],
                attributesForFaceting: ['filterOnly(tags)', 'contentType', 'isSpark'],
                customRanking: ['desc(likes)', 'desc(viewCount)', 'desc(createdAt)'],
                replicas: ['kihumba_posts_recent']
            }
        });

        await client.setSettings({
            indexName: 'kihumba_posts_recent',
            indexSettings: {
                customRanking: ['desc(createdAt)']
            }
        });

        await client.setSettings({
            indexName: 'kihumba_users',
            indexSettings: {
                searchableAttributes: ['username', 'fullName'],
                customRanking: ['desc(createdAt)']
            }
        });

        console.log('✨ Algolia configuration complete.');

    } catch (error) {
        console.error('❌ Sync failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

sync();
