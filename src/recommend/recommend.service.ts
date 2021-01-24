import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Group } from 'src/entity/Group.entity';

@Injectable()
export class RecommendService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  async getOthers(userId) {
    const others = await this.groupRepository.find({
      where: { user: { id: userId } },
    });
    return others;
  }
}
