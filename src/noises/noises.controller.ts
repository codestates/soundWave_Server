import { Controller, Res, HttpStatus } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { NoisesService } from './noises.service';
import { Response } from 'express';

@Controller('noises')
export class NoisesController {
  constructor(private readonly noiseService: NoisesService) {}

  @Get()
  async findAll(@Res() res: Response): Promise<any> {
    const noiseList = await this.noiseService.getAllNoises();

    res.status(HttpStatus.OK).json({
      data: {
        noises: noiseList,
      },
    });
  }
}
