import { Test, TestingModule } from '@nestjs/testing';
import { NoisesController } from './noises.controller';

describe('NoisesController', () => {
  let controller: NoisesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoisesController],
    }).compile();

    controller = module.get<NoisesController>(NoisesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
