import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Noise } from '../../db/src/entity/Noise.entity';

@Injectable()
export class NoisesService {
  constructor(
    @InjectRepository(Noise)
    private readonly noiseRepository: Repository<Noise>
  ) {}
   
  async getAllNoises(): Promise<Noise[]> {
    return this.noiseRepository.createQueryBuilder("noise").select(['noise.name', 'noise.url']).getMany();
  }

}
