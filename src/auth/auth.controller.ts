import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  Req,
  Redirect,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('/auth/login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // facebook 로그인 요청 시
  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  // facebook 로그인 시도 후 리디렉션 라우터
  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }

  //google 로그인 요청
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  // google redirect
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    return this.authService.googleLogin(req, res);
  }
}
