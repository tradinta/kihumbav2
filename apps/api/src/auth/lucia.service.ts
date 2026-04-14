import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';

// Register Lucia type globally for Next.js and NestJS sharing
declare module "lucia" {
	interface Register {
		Lucia: typeof import('./lucia.service').lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
	email: string | null;
  phoneNumber: string | null;
  role: string;
  isBanned: boolean;
}

// Ensure it's exported for typing
export let lucia: Lucia;

@Injectable()
export class LuciaService implements OnModuleInit {
  private _lucia!: Lucia;

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    const adapter = new PrismaAdapter(this.prisma.session, this.prisma.user);

    this._lucia = new Lucia(adapter, {
      sessionCookie: {
        expires: false,
        attributes: {
          secure: process.env.NODE_ENV === "production"
        }
      },
      getUserAttributes: (attributes) => {
        return {
          username: attributes.username,
          email: attributes.email,
          phoneNumber: attributes.phoneNumber,
          role: attributes.role,
          isBanned: attributes.isBanned,
        };
      }
    });
    
    // Bind to the global export for type inference
    lucia = this._lucia;
  }

  get auth() {
    return this._lucia;
  }
}
