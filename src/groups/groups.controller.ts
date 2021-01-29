import { Controller, Post, Body, Request, Response, Get, Query, Param, Delete } from '@nestjs/common';
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
  async findAllGroups(@Request() req, @Query() query, @Response() res) {
    const accessToken = await req.headers.authorization;
    const userId: number = Number(query.userId);
    const data = await this.groupsService.findAllGroups(userId, accessToken);

    if (data === "유효하지 않은 토큰입니다!") {
      res.status(401).send({message : data});
    } else if (data === "저장된 그룹이 없는 유저!") {
      res.status(406).send({message : data });
    }
    else {
      res.status(200).send({ data, message: "해당 유저의 그룹을 성공적으로 불러왔습니다!" })
    }
  }

  @Delete('/delete/:id')
  async deleteGroups(@Param('id') param, @Request() req, @Response() res) {
    const accessToken = req.headers.authorization;
    const groupId = Number(param);

    const data = await this.groupsService.deleteGroupRequest(groupId, accessToken);

    if (data === "유효하지 않은 토큰입니다!") {
      res.status(401).send({ message : data });
    } else if (data === "그룹 삭제 완료!") {
      res.status(200).send({ message : data });
    }
  }
}

