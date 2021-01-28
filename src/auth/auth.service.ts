import { Injectable, Redirect } from '@nestjs/common';

@Injectable()
export class AuthService {
  googleLogin(req, res) {
    if (!req.user) {
      return 'No user from google';
    } else {
      res.cookie('oathInfo', req.user, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      res.redirect('https://localhost:3001');
      // return {
      //   message: 'User information from google',
      //   user: req.user,
      // };
    }
  }
}
