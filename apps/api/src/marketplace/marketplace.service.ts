import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../utils/r2.service';
import { CreateListingDto, CreateOrderDto, AssignSaccoDto } from './marketplace.dto';

@Injectable()
export class MarketplaceService {
    constructor(
        private prisma: PrismaService,
        private r2: R2Service,
    ) { }

    // ─── Media Uploads (R2) ────────────────────────────────────────────────

    async getUploadUrls(userId: string, count: number, contentType: string) {
        // Enforce max 5 photos per item
        const limit = Math.min(count, 5);
        const slots: any[] = [];

        for (let i = 0; i < limit; i++) {
            const slot = await this.r2.getPresignedUploadUrl(contentType, `marketplace/${userId}/`);
            slots.push(slot);
        }

        return slots;
    }

    // ─── Listings ──────────────────────────────────────────────────────────

    async createListing(userId: string, dto: CreateListingDto) {
        return this.prisma.marketListing.create({
            data: {
                title: dto.title,
                description: dto.description,
                price: dto.price,
                category: dto.category as any,
                tradeType: dto.tradeType as any,
                barterFor: dto.barterFor,
                condition: dto.condition as any,
                county: dto.county,
                area: dto.area,
                images: dto.images,
                tags: dto.tags || [],
                whatsIncluded: dto.whatsIncluded || [],
                sellerPhone: dto.sellerPhone,
                sellerId: userId,
            },
        });
    }

    async getListings(filters: any) {
        const { category, county, tradeType, q, sellerId, skip = 0, take = 20 } = filters;

        const items = await this.prisma.marketListing.findMany({
            where: {
                isActive: true,
                sellerId: sellerId ? sellerId : undefined,
                category: category ? (category as any) : undefined,
                county: county ? county : undefined,
                tradeType: tradeType ? (tradeType as any) : undefined,
                OR: q ? [
                    { title: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } },
                    { tags: { has: q } },
                ] : undefined,
            },
            include: {
                seller: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        avatar: true,
                        isVerified: true,
                    },
                },
                _count: { select: { comments: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: take + 1, // Fetch one extra to check if there's more
        });

        const hasMore = items.length > take;
        const results = hasMore ? items.slice(0, take) : items;

        return {
            items: results,
            hasMore
        };
    }

    async getListingById(id: string) {
        const listing = await this.prisma.marketListing.findUnique({
            where: { id },
            include: {
                seller: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        avatar: true,
                        isVerified: true,
                        sellerProfile: true, // Professional details
                    },
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                avatar: true,
                            },
                        },
                        replies: {
                            include: {
                                author: {
                                    select: {
                                        id: true,
                                        username: true,
                                        fullName: true,
                                        avatar: true,
                                    },
                                },
                            },
                        },
                    },
                    where: { parentId: null }, // Only top-level comments
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!listing) throw new NotFoundException('Listing not found');

        // Increment view count (async, don't wait)
        this.prisma.marketListing.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        }).catch(() => { });

        return listing;
    }

    // ─── Orders & Logistics ────────────────────────────────────────────────

    async createOrder(buyerId: string, dto: CreateOrderDto) {
        const listing = await this.prisma.marketListing.findUnique({
            where: { id: dto.listingId }
        });
        if (!listing) throw new NotFoundException('Listing not found');

        return this.prisma.marketOrder.create({
            data: {
                amount: dto.amount,
                buyerId: buyerId,
                sellerId: listing.sellerId,
                listingId: listing.id,
                status: 'PAID', // In a real app, this would trigger after payment gateway callback
                escrowHeld: true,
            }
        });
    }

    async getOrders(userId: string, role: 'buyer' | 'seller' | 'admin') {
        const where: any = {};
        if (role === 'buyer') where.buyerId = userId;
        else if (role === 'seller') where.sellerId = userId;
        // Admin (Logistics) gets all active orders with saccoName assigned
        else where.NOT = { saccoName: null };

        return this.prisma.marketOrder.findMany({
            where,
            include: {
                listing: true,
                buyer: { select: { fullName: true, phoneNumber: true } },
                seller: { select: { fullName: true, phoneNumber: true } },
            },
            orderBy: { updatedAt: 'desc' }
        });
    }

    async assignSacco(orderId: string, userId: string, dto: AssignSaccoDto) {
        const order = await this.prisma.marketOrder.findUnique({
            where: { id: orderId }
        });

        if (!order || order.sellerId !== userId) {
            throw new NotFoundException('Order not found or not authorized');
        }

        // Generate a 6-digit delivery code for the buyer to provide to the driver
        const deliveryCode = Math.floor(100000 + Math.random() * 900000).toString();

        return this.prisma.marketOrder.update({
            where: { id: orderId },
            data: {
                saccoName: dto.saccoName,
                driverName: dto.driverName,
                driverPhone: dto.driverPhone,
                deliveryCode: deliveryCode,
                status: 'PENDING', // Waiting for SACCO pickup
            }
        });
    }

    async updateOrderStatus(orderId: string, status: string) {
        return this.prisma.marketOrder.update({
            where: { id: orderId },
            data: { status: status as any }
        });
    }

    async verifyDelivery(orderId: string, code: string) {
        const order = await this.prisma.marketOrder.findUnique({
            where: { id: orderId }
        });

        if (!order || order.deliveryCode !== code) {
            throw new Error('Invalid delivery code');
        }

        return this.prisma.marketOrder.update({
            where: { id: orderId },
            data: {
                status: 'COMPLETED',
                escrowHeld: false,
            }
        });
    }
}
