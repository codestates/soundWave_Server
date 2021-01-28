import {  Controller, Post, Body, Request, Response, Get, Query } from '@nestjs/common';
import { CreateGroupDto } from './dto/CreateGroupDto';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async findGroupcombNoiseData(@Body() group: CreateGroupDto, @Request() req, @Response() res) {
    const accessToken = await req.headers.authorization;
    const result = await this.groupsService.findGroupcombNoiseData(group, accessToken);

    if (result === "그룹 저장 성공!") {
    return res.status(200).send({ data : result})
    } else if (result === "이미 동일한 이름의 그룹이 존재합니다.") {
      res.status(400).send({data: result});
    } else if (result === "유효하지 않은 토큰입니다!") {
      res.status(401).send({data: result});
    }
    
  }

  @Get()
  async findAllGroups(@Request() req, @Query() query) {
    const accessToken = await req.headers.authorization;
    console.log(query);
    // return this.groupsService.findAllGroups();
  }

}
