import {
    Controller, Get, Post, Body, Param, Query,
    UseGuards, Req,
} from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { CreateListingDto } from './marketplace.dto';
import { AuthGuard } from '../auth/better-auth';

@Controller('marketplace')
export class MarketplaceController {
    constructor(private readonly marketplaceService: MarketplaceService) { }

    @Get('listings')
    getListings(
        @Query('category') category?: string,
        @Query('county') county?: string,
        @Query('tradeType') tradeType?: string,
        @Query('q') q?: string,
        @Query('skip') skip?: string,
        @Query('take') take?: string,
    ) {
        return this.marketplaceService.getListings({
            category,
            county,
            tradeType,
            q,
            skip: skip ? parseInt(skip) : 0,
            take: take ? parseInt(take) : 20,
        });
    }

    @Get('listings/:id')
    getListingById(@Param('id') id: string) {
        return this.marketplaceService.getListingById(id);
    }

    @Post('listings')
    @UseGuards(AuthGuard)
    createListing(@Req() req: any, @Body() dto: CreateListingDto) {
        return this.marketplaceService.createListing(req.user.id, dto);
    }

    @Post('upload-urls')
    @UseGuards(AuthGuard)
    getUploadUrls(
        @Req() req: any, 
        @Body() body: { count: number; contentType: string }
    ) {
        return this.marketplaceService.getUploadUrls(
            req.user.id, 
            body.count || 1, 
            body.contentType || 'image/jpeg'
        );
    }

    // ─── Orders & Logistics ────────────────────────────────────────────────

    @Post('orders')
    @UseGuards(AuthGuard)
    createOrder(@Req() req: any, @Body() dto: any) {
        return this.marketplaceService.createOrder(req.user.id, dto);
    }

    @Get('orders')
    @UseGuards(AuthGuard)
    getOrders(@Req() req: any, @Query('role') role: 'buyer' | 'seller' | 'admin' = 'buyer') {
        return this.marketplaceService.getOrders(req.user.id, role);
    }

    @Post('orders/:id/assign-sacco')
    @UseGuards(AuthGuard)
    assignSacco(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
        return this.marketplaceService.assignSacco(id, req.user.id, dto);
    }

    @Post('orders/:id/status')
    @UseGuards(AuthGuard)
    updateOrderStatus(@Param('id') id: string, @Body() dto: { status: string }) {
        // In a real app, check if user is a logistics admin or driver
        return this.marketplaceService.updateOrderStatus(id, dto.status);
    }

    @Post('orders/:id/verify')
    @UseGuards(AuthGuard)
    verifyDelivery(@Param('id') id: string, @Body() dto: { deliveryCode: string }) {
        return this.marketplaceService.verifyDelivery(id, dto.deliveryCode);
    }
}
