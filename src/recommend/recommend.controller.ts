import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecommendService } from './recommend.service';

@Controller('recommend')
export class RecommendController {
  constructor(private readonly recommendService: RecommendService) {}
  @Get('others/:id')
  getOthers(@Param('id') userId: number) {
    return this.recommendService.getOthers(userId);
  }

  @Get('/')
  getRecommend(@Query() query) {
    return this.recommendService.getRecommend(query);
  }

  @Get('/test')
  gettest(@Query() query) {
    return this.recommendService.test(query);
  }
}
