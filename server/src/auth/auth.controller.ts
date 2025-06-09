import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { SiweMessage, generateNonce } from 'siwe';

@Controller('auth')
export class AuthController {
  private address: string = '';

  @Get()
  root(@Res() res: Response) {
    return res.send('Hello World');
  }

  @Get('nonce')
  getNonce(@Res() res: Response) {
    const nonce = generateNonce();
    return res.status(HttpStatus.OK).json({ nonce });
  }

  @Get('me')
  getMe(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({ address: this.address });
  }

  @Post('verify')
  async verify(@Body() body: any, @Res() res: Response) {
    const { message, signature } = body;
    console.log(body);
    try {
      const siweMessage = new SiweMessage(message);
      const result = await siweMessage.verify({ signature });
      if (result.success) {
        this.address = result.data.address;
        console.log('address: ', this.address);
      }
      return res.status(HttpStatus.OK).json({ ok: result.success });
    } catch (error) {
      console.log('error: ', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  @Get('logout')
  logout(@Res() res: Response) {
    this.address = '';
    return res.status(HttpStatus.OK).json({ ok: true });
  }
}
