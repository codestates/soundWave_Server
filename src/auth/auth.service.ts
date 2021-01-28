import { Injectable, Redirect } from '@nestjs/common';
import e from 'express';
import { userInfo } from 'os';
import { getRepository, Repository, getConnection } from 'typeorm';
import { User } from '../entity/User.entity';

@Injectable()
export class AuthService {
  async googleLogin(req, res) {
    if (!req.user) {
      res.redirect('https://localhost:3001');
      // return 'No user from google';
    } else {
      const email = req.user.email;
      const findUser = await getRepository(User)
        .createQueryBuilder('user')
        .where('user.email = :email', { email: email })
        .getOne();
      if (!findUser) {
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(User)
          .values([
            { email: email, oauth: 'google', profile: req.user.picture },
          ])
          .execute();
      }
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
