import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKaoListingDto, CreateKaoReviewDto } from './kao.dto';
import { PropertyType, ListingType } from '@prisma/client';

@Injectable()
export class KaoService {
    constructor(private prisma: PrismaService) {}

    async createListing(userId: string, dto: CreateKaoListingDto) {
        return this.prisma.kaoListing.create({
            data: {
                ...dto,
                authorId: userId,
                // Ensure individual listings don't accidentally get verified status unless by admin
                isVerified: false,
            },
        });
    }

    async getListings(filters: {
        type?: PropertyType;
        listingType?: ListingType;
        county?: string;
        area?: string;
        search?: string;
        authorId?: string;
    }) {
        const { type, listingType, county, area, search, authorId } = filters;

        return this.prisma.kaoListing.findMany({
            where: {
                authorId: authorId || undefined,
                type: type || undefined,
                listingType: listingType || undefined,
                county: county || undefined,
                area: area || undefined,
                OR: search ? [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { area: { contains: search, mode: 'insensitive' } },
                ] : undefined,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        avatar: true,
                        isVerified: true,
                    },
                },
                _count: {
                    select: { reviews: true, comments: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getListingById(id: string) {
        const listing = await this.prisma.kaoListing.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        avatar: true,
                        isVerified: true,
                    },
                },
                reviews: {
                    include: {
                        author: {
                            select: {
                                username: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                comments: true,
            },
        });

        if (!listing) throw new NotFoundException('Listing not found');
        return listing;
    }

    async findNearby(lat: number, lng: number, radiusKm: number = 5) {
        // Haversine formula in raw SQL
        // Earth radius is approx 6371 km
        return this.prisma.$queryRaw`
            SELECT *, 
            (6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lng) - radians(${lng})) + sin(radians(${lat})) * sin(radians(lat)))) AS distance
            FROM "KaoListing"
            WHERE (6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lng) - radians(${lng})) + sin(radians(${lat})) * sin(radians(lat)))) <= ${radiusKm}
            ORDER BY distance ASC
        `;
    }

    async addReview(userId: string, listingId: string, dto: CreateKaoReviewDto) {
        return this.prisma.kaoReview.create({
            data: {
                ...dto,
                authorId: userId,
                listingId,
            },
        });
    }

    // ─── Roommate Requests ───

    async createRequest(senderId: string, listingId: string, message?: string) {
        const listing = await this.prisma.kaoListing.findUnique({
            where: { id: listingId },
            select: { authorId: true }
        });

        if (!listing) throw new NotFoundException('Listing not found');
        if (listing.authorId === senderId) throw new Error('Cannot request your own listing');

        return this.prisma.kaoRequest.create({
            data: {
                listingId,
                senderId,
                receiverId: listing.authorId,
                message,
            },
            include: {
                listing: { select: { title: true } },
                sender: { select: { username: true, avatar: true } }
            }
        });
    }

    async getRequests(userId: string, type: 'SENT' | 'RECEIVED') {
        return this.prisma.kaoRequest.findMany({
            where: type === 'SENT' ? { senderId: userId } : { receiverId: userId },
            include: {
                listing: { select: { id: true, title: true, images: true } },
                sender: { select: { id: true, username: true, avatar: true, fullName: true } },
                receiver: { select: { id: true, username: true, avatar: true, fullName: true } },
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getMyActivity(userId: string) {
        const [listings, sentRequests, receivedRequests] = await Promise.all([
            this.prisma.kaoListing.findMany({
                where: { authorId: userId },
                include: { requests: { include: { sender: { select: { username: true, avatar: true, gender: true, dateOfBirth: true } } } } },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.kaoRequest.findMany({
                where: { senderId: userId },
                include: { listing: true, receiver: { select: { username: true, avatar: true } } },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.kaoRequest.findMany({
                where: { receiverId: userId },
                include: { listing: true, sender: { select: { username: true, avatar: true, gender: true, dateOfBirth: true } } },
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { listings, sentRequests, receivedRequests };
    }

    async updateRequestStatus(userId: string, requestId: string, status: 'ACCEPTED' | 'DECLINED') {
        const request = await this.prisma.kaoRequest.findUnique({
            where: { id: requestId }
        });

        if (!request) throw new NotFoundException('Request not found');
        if (request.receiverId !== userId) throw new Error('Not authorized to manage this request');

        return this.prisma.kaoRequest.update({
            where: { id: requestId },
            data: { status },
        });
    }
}
