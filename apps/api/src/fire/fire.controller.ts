import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { FireService } from './fire.service';
import { AuthGuard } from '../auth/better-auth';

@Controller('fires')
export class FireController {
  constructor(private readonly fireService: FireService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Req() req: any, @Body() body: { mediaUrl: string; content?: string }) {
    const userId = req.user.id;
    return this.fireService.create(userId, body);
  }

  @Get()
  async findAll() {
    return this.fireService.findAllActive();
  }

  @Post(':id/view')
  @UseGuards(AuthGuard)
  async view(@Req() req: any, @Param('id') id: string) {
    return this.fireService.recordView(id, req.user.id);
  }

  @Get(':id/viewers')
  @UseGuards(AuthGuard)
  async getViewers(@Param('id') id: string) {
    return this.fireService.getViewers(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    return this.fireService.delete(userId, id);
  }
}
