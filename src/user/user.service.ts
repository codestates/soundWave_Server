import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { User } from 'src/entity/User.entity';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  async findOrCreate(user: UserDto): Promise<any> {
    // 유저 정보를 받아온 후 db에 정보가 없다면 저장
    const checkedUser = await this.findAndCheckedUser(user.email, user.oauth);
    let userId;
    
    // 유저가 없다면
    if (!checkedUser) {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          { email: user.email, oauth: user.oauth, profile: user.profileImage}, 
        ])
        .execute();

        userId = (await this.findAndCheckedUser(user.email, user.oauth)).id;
    } else {
      userId = checkedUser.id;
    }
    
    let requiredUserInfo = {
      name : user.name,
      userId,
      profile : user.profileImage
    }

    return requiredUserInfo;
  }

  findAndCheckedUser = async(email: string, oauth: string) => {
    return await getConnection()
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .where("user.email = :email", { email })
      .andWhere("user.oauth = :oauth", { oauth })
      .getOne();
  }
}

