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
      callbackURL: "https://localhost:3000/auth/login/facebook/redirect",
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

// {
//   "statusCode":200,
//   "data" : {
//     "user" : {
//       "name" : "정하랑",
//       "profile" : "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1833401046814451&height=50&width=50&ext=1614008922&hash=AeT95vqzn9AzRcLuwzw"
//     },
//     "accessToken" : "EAAK9TzzZB2fgBAPYPdZCFIZCQzbiGI5gWcayZAITdZB3ZCuQ2mrqZAspfDEbqrxlBSktbpbN5VHMNgwWIbYbR96blwbNLm1MgqQXK7QV3xq6Y5BTS4OY5JFbpJF3Kn7SNpZBrcQs7cZBcDEGZBZBuypAPB0eA0i3MD6XkPUiMZBXVMNcUQZDZD"
//   }
// }