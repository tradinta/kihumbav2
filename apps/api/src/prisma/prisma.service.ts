import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as dotenv from 'dotenv';

function loadEnv() {
    dotenv.config({ path: path.join(__dirname, '../../.env') });
    dotenv.config({ path: path.join(__dirname, '../../../../.env') });
}

function getCleanDatabaseUrl(): string {
    const rawUrl = process.env.DATABASE_URL || '';
    return rawUrl.trim().replace(/^["']|["']$/g, '').trim();
}

loadEnv();

import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws; // Polyfill WebSocket in Node.js

@Injectable()
export class PrismaService extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

    constructor() {
        const connectionString = getCleanDatabaseUrl();
        
        // If connecting to Neon, run Prisma over WebSockets to bypass TCP 5432 blocks
        if (connectionString.includes('neon.tech')) {
            const adapter = new PrismaNeon({ connectionString: connectionString });
            super({ adapter, log: ['error', 'warn'] });
        } else {
            // Fallback for local/standard DBs
            super();
        }
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}

