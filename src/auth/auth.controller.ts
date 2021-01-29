import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // facebook 로그인 요청 시
  @Get('login/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  // facebook 로그인 시도 후 리디렉션 라우터
  @Get('login/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: Request, @Res() res): Promise<any> {
    res.cookie('oauthInfo', req.user, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.redirect('https://localhost:3001');
  }

  //google 로그인 요청
  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  // google redirect
  @Get('login/google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    return this.authService.googleLogin(req, res);
  }

  @Get('login/check')
  async checkUser(@Req() req, @Res() res) {
    res.status(200).send(req.cookies.oauthInfo);
  }
  @Get('logout')
  logOut(@Req() req, @Res() res) {
    return this.authService.logOut(req, res);
  }
}
