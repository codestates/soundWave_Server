import { Injectable, Redirect } from '@nestjs/common';
import e from 'express';
import { userInfo } from 'os';
import { getRepository, Repository, getConnection } from 'typeorm';
import { User } from '../entity/User.entity';

@Injectable()
export class AuthService {
  async googleLogin(req, res) {
    if (!req.user) {
      res.redirect('https://www.sounds-wave.com');
      // return 'No user from google';
    } else {
      const email = req.user.email;
      const findUser = await getRepository(User)
        .createQueryBuilder('user')
        .where('user.email = :email', { email: email })
        .andWhere('user.oauth = :oauth', { oauth: req.user.oauth })
        .getOne();

      if (!findUser) {
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(User)
          .values([
            {
              email: email,
              oauth: req.user.oauth,
              profile: req.user.profile,
            },
          ])
          .execute();
      }
      // console.log(findUser.id);
      const userId = await getRepository(User)
        .createQueryBuilder('user')
        .where('user.email = :email', { email: email })
        .andWhere('user.oauth = :oauth', { oauth: req.user.oauth })
        .getOne()
        .then((data) => {
          return data.id;
        });

      const oauthInfo = {
        accessToken: req.user.accessToken,
        user: {
          name: req.user.name,
          profile: req.user.profile,
          userId: userId,
        },
      };
      console.log(oauthInfo);
      res.cookie('oauthInfo', oauthInfo, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      res.redirect('https://www.sounds-wave.com');
      // return {
      //   message: 'User information from google',
      //   user: req.user,
      // };
    }
  }
  logOut(req, res) {
    try {
      res.clearCookie('oauthInfo').status(200).json({
        message: '로그아웃 성공!',
      });
    } catch {
      res.status(401).send({
        message: '로그아웃 실패!',
      });
    }
  }
}
