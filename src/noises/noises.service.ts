import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Noise } from '../entity/Noise.entity';

@Injectable()
export class NoisesService {
  constructor(
    @InjectRepository(Noise)
    private readonly noiseRepository: Repository<Noise>,
  ) {}

  async getAllNoises() {
    const checkedNoise = await this.findAndCheckNoise();

    if (!checkedNoise.length) {
      // 노이즈가 없다면
      await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Noise)
      .values([
        { id: 1, name: 'rain', url: '226690288' },
        { id: 2, name: 'wave', url: '326702198' },
        { id: 3, name: 'campfire', url: '13285945' },
        { id: 4, name: 'drive', url: '648410951' },
        { id: 5, name: 'night', url: '366135758' }
      ])
      .execute();

      return await this.findAndCheckNoise();
    }
    return checkedNoise;
  }

  async findAndCheckNoise() {
    return await this.noiseRepository
    .createQueryBuilder('noise')
    .select(['noise.name', 'noise.url'])
    .getMany();
  }
}
