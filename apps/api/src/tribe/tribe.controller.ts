import { Controller, Get, Post, Body, Param, Query, UseGuards, Put, Patch } from '@nestjs/common';
import { TribeService } from './tribe.service';
import { CreateTribeDto, JoinTribeDto, ManageMemberDto, TribeReportDto } from './tribe.dto';
import { AuthGuard, SoftAuthGuard } from '../auth/better-auth';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('tribes')
export class TribeController {
    constructor(private readonly tribeService: TribeService) { }

    // Verify slug uniqueness
    @Get('exists/:slug')
    async checkExists(@Param('slug') slug: string) {
        return this.tribeService.checkExists(slug);
    }

    @Patch(':id/settings')
    @UseGuards(AuthGuard)
    async updateSettings(@Param('id') id: string, @Body() data: any, @CurrentUser('id') userId: string) {
        return this.tribeService.updateSettings(userId, id, data);
    }

    @Get(':id/join-requests')
    @UseGuards(AuthGuard)
    async getJoinRequests(@Param('id') id: string, @CurrentUser('id') userId: string) {
        return this.tribeService.getJoinRequests(userId, id);
    }

    @Post('join-requests/:requestId/respond')
    @UseGuards(AuthGuard)
    async respondToJoinRequest(@Param('requestId') requestId: string, @Body('approve') approve: boolean, @CurrentUser('id') userId: string) {
        return this.tribeService.respondToJoinRequest(userId, requestId, approve);
    }

    @Post(':id/invite')
    @UseGuards(AuthGuard)
    async generateInvite(@Param('id') id: string, @CurrentUser('id') userId: string) {
        return this.tribeService.generateInvite(userId, id);
    }

    @Get('invite/:code')
    async getInviteByCode(@Param('code') code: string) {
        return this.tribeService.getInviteByCode(code);
    }

    @Post(':id/record-visit')
    async recordVisit(@Param('id') id: string) {
        return this.tribeService.recordVisit(id);
    }

    @Get(':id/members-roster')
    async getMembers(@Param('id') id: string, @Query('q') query?: string) {
        return this.tribeService.getMembers(id, query);
    }

    @Get('suggested')
    @UseGuards(AuthGuard)
    async getSuggested(@CurrentUser('id') userId: string) {
        return this.tribeService.getSuggested(userId);
    }

    @Get()
    async findAll(@Query('category') category?: string) {
        return this.tribeService.findAll(category);
    }

    @Get(':slugOrId')
    @UseGuards(SoftAuthGuard)
    async findOne(
        @Param('slugOrId') slugOrId: string,
        @CurrentUser('id') userId?: string
    ) {
        return this.tribeService.findOne(slugOrId, userId);
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(
        @CurrentUser('id') userId: string,
        @Body() dto: CreateTribeDto
    ) {
        return this.tribeService.create(userId, dto);
    }

    @Post(':id/join')
    @UseGuards(AuthGuard)
    async join(
        @CurrentUser('id') userId: string,
        @Param('id') tribeId: string,
        @Body() dto: JoinTribeDto
    ) {
        return this.tribeService.join(userId, tribeId, dto);
    }

    @Post(':id/leave')
    @UseGuards(AuthGuard)
    async leave(
        @CurrentUser('id') userId: string,
        @Param('id') tribeId: string
    ) {
        return this.tribeService.leave(userId, tribeId);
    }

    @Patch(':id/manage-member')
    @UseGuards(AuthGuard)
    async manageMember(
        @CurrentUser('id') actorId: string,
        @Param('id') tribeId: string,
        @Body() dto: ManageMemberDto
    ) {
        return this.tribeService.manageMember(actorId, tribeId, dto);
    }

    @Post(':id/report')
    @UseGuards(AuthGuard)
    async report(
        @CurrentUser('id') userId: string,
        @Param('id') tribeId: string,
        @Body() dto: TribeReportDto
    ) {
        return this.tribeService.report(userId, tribeId, dto);
    }
}
