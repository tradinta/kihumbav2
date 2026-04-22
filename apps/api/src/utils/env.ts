import * as path from 'path';
import * as dotenv from 'dotenv';

/**
 * Robustly loads environment variables for the NestJS API.
 * Uses multiple potential paths to ensure coverage across Turborepo structures.
 */
export function loadEnv() {
    // Check locally first, then go up to the monorepo root
    dotenv.config({ path: path.join(__dirname, '../../.env') });
    dotenv.config({ path: path.join(__dirname, '../../../../.env') });
}

/**
 * Sanitizes and returns the DATABASE_URL.
 * Handles quotes and trailing whitespace that common .env parsers might miss.
 */
export function getCleanDatabaseUrl(): string {
    const rawUrl = process.env.DATABASE_URL || '';
    
    // 1. Trim first to remove any accidental padding outside quotes
    // 2. Remove standard quotes
    // 3. Trim again to remove padding inside quotes
    const cleanUrl = rawUrl.trim().replace(/^["']|["']$/g, '').trim();
    
    if (!cleanUrl) {
        console.warn('⚠️ [ENV] DATABASE_URL is missing or empty.');
    }
    
    return cleanUrl;
}
