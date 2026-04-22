import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './better-auth';

@Controller('auth')
export class BetterAuthController {
    @All('*')
    async handleAuth(@Req() req: Request, @Res() res: Response) {
        return toNodeHandler(auth)(req, res);
    }
}
