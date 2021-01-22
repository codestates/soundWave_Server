import { Test, TestingModule } from '@nestjs/testing';
import { NoisesService } from './noises.service';

describe('NoisesService', () => {
  let service: NoisesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoisesService],
    }).compile();

    service = module.get<NoisesService>(NoisesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
