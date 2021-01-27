import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { User } from 'src/entity/User.entity';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  async findOrCreate(user: UserDto): Promise<any> {
    // 유저 정보를 받아온 후 db에 정보가 없다면 저장
    const checkedUser = await getConnection()
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .where("user.email = :email", { email: user.email })
      .andWhere("user.oauth = :oauth", { oauth: user.oauth })
      .getOne();
    
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
    }
    
    const userId = await checkedUser.id;
    
    let requiredUserInfo = {
      name : user.name,
      userId,
      profile : user.profileImage
    }

    return requiredUserInfo;
  }
}

