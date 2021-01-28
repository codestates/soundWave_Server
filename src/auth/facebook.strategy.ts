import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";
import { UserService } from 'src/user/user.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor(private readonly userService: UserService) {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.URL}/auth/login/facebook/redirect`,
      scope: ["email", "public_profile"],
      profileFields: ["emails" ,"name", "photos"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    const { name, photos, emails } = profile;
    // console.log(profile);
    const allUserInfo = {
      email: emails[0].value,
      name: `${name.familyName}${name.givenName}`,
      profileImage: photos[0].value,
      oauth: "facebook"
    };
    
    const findOrCreateUser = await this.userService.findOrCreate(allUserInfo);

    const payload = {
      user : await findOrCreateUser,
      accessToken,
    };

    done(null, payload);
  }
}