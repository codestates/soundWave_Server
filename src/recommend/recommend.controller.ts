import { Controller, Get, Param } from '@nestjs/common';
import { RecommendService } from './recommend.service';

@Controller('recommend')
export class RecommendController {
  constructor(private readonly recommendService: RecommendService) {}
  @Get('others/:id')
  getOthers(@Param('id') userId: number) {
    return this.recommendService.getOthers(userId);
  }
}
