// Kihumba API — NestJS entry point
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { json, urlencoded } from 'express';

async function bootstrap() {
    // 1. Create app without default body parser (we handle it manually for Better Auth)
    const app = await NestFactory.create(AppModule, {
        bodyParser: false,
    });

    // 2. Global Prefix
    app.setGlobalPrefix('api');

    // 3. Selective Body Parsing
    // Better Auth handles its own raw body stream, so we bypass parsing for /api/auth/*
    app.use((req: any, res: any, next: any) => {
        if (req.url.startsWith('/api/auth')) {
            next();
        } else {
            // Standard JSON/URL-encoded parsing for all other routes (Posts, Market, etc.)
            json({ limit: '10mb' })(req, res, () => {
                urlencoded({ extended: true, limit: '10mb' })(req, res, next);
            });
        }
    });

    // 4. CORS
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });

    // 5. Security & Validation
    app.use(helmet({
        contentSecurityPolicy: false, // Disable CSP for local dev to avoid blocking Better Auth flows
    }));

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    // 6. Start Server
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Kihumba API (Native Mode) running on http://localhost:${port}/api`);
}

bootstrap();
