import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { createQueryBuilder, getConnection, getManager, Repository } from 'typeorm';
import { GroupcombNoiseIdDto } from './dto/groupcombNoiseIdDto';
import { CreateGroupDto } from './dto/CreateGroupDto';
import { Group } from 'src/entity/Group.entity';
import { Noise } from 'src/entity/Noise.entity';
import { Groupcomb_noise } from 'src/entity/Groupcomb_noise.entity';
import { Groupcomb_music } from 'src/entity/Groupcomb_music.entity';
import { Music_volume } from 'src/entity/Music_volume.entity';
import { Noise_volume } from 'src/entity/Noise_volume.entity';
import { User } from 'src/entity/User.entity';
import { Weather } from './../entity/Weather.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,

    @InjectRepository(Noise)
    private noiseRepository: Repository<Noise>,

    @InjectRepository(Groupcomb_noise)
    private groupcombNoiseRepository: Repository<Groupcomb_noise>,

    @InjectRepository(Groupcomb_music)
    private groupcombMusicRepository: Repository<Groupcomb_music>,

    @InjectRepository(Weather)
    private weatherRepository: Repository<Weather>,
  ) {}

  async findGroupcombNoiseData(group: CreateGroupDto, token: string | undefined): Promise<string> {
    let noiseNames = [];

    if (!token) {
      return "유효하지 않은 토큰입니다!"
    }

    const checkSameGroupname = await this.findUserGroupName(group.groupName, group.userId);
    
    if (checkSameGroupname.length) {
      return "이미 동일한 이름의 그룹이 존재합니다."
    }

    await group.noises.forEach((noise: any) => {
      noiseNames.push(noise.name);
    });
    
    // noise 배열의 name으로 db내 noiseId를 찾는다
    const findNoiseId: any[] = await this.noiseRepository
    .createQueryBuilder('noise')
    .select("noise.id")
    .where("noise.name IN (:...name)", { name: noiseNames })
    .getMany()

    //[ Noise { id: 1 }, Noise { id: 2 } ]
    let noiseId = [];

    await findNoiseId.forEach((el: any) => {
      noiseId.push(el.id);
    });

    const noiseIdList = await noiseId.join(',');

    const groupNoise = await this.groupcombNoiseRepository
    .createQueryBuilder('groupcombNoise')
    .select(['GROUP_CONCAT(groupcombNoise.noiseId)', 'groupcombNoise.groupcombId'])
    .groupBy('groupcombNoise.groupcombId')
    .getRawMany();
    // [
    //   RowDataPacket {
    //     groupcombNoise_groupcombId: 1,
    //     'GROUP_CONCAT(`groupcombNoise`.`noiseId`)': '1,2'
    //   },
    //   RowDataPacket {
    //     groupcombNoise_groupcombId: 2,
    //     'GROUP_CONCAT(`groupcombNoise`.`noiseId`)': '1'
    //   }
    // ]
    let findLastCombIdTask = await this.findGroupcombNoiseId(groupNoise, noiseIdList);
    // groubcomb_Noise에 없다면, 마지막 groupcombId를 찾아 재할당
    if (!findLastCombIdTask.checked) {
      const findLastCombId = await this.groupcombNoiseRepository
      .createQueryBuilder('groupcombNoise')
      .select('MAX(groupcombId)')
      .getRawOne()

      let lastCombIdKey = Object.keys(findLastCombId)[0];

      findLastCombIdTask.groupcombId = findLastCombId[lastCombIdKey] + 1;
      
      // groupcomb_noise 엔티티에 db를 저장
      await this.saveGroupcombNoise(noiseId, findLastCombIdTask.groupcombId);
    }
    
    // Groupcomb_music 엔티티에 db 저장
    const groupcombMusicId = await this.saveGroupcombMusic(group.music, findLastCombIdTask.groupcombId);
      // SELECT groupcombId, GROUP_CONCAT(noiseId) FROM soundwave.groupcomb_noise GROUP BY groupcombId;
    const groupId = await this.saveGroup(group, groupcombMusicId);

      // const groupId = await checkedGroup;
      await this.saveMusicVolume(group.music, groupId);
      await this.saveNoiseVolume(group.noises, groupId);
      return "그룹 저장 성공!";
  }
  
  findGroupcombNoiseId = async (noises: any[], id: string) => {
    let checked: boolean = false;
    let groupcombId: number = 0;

    await noises.forEach((obj: any) => {
      for (let key in obj) {
        if (key !== "groupcombNoise_groupcombId" && obj[key] === id) {
          checked = true;
          groupcombId = obj.groupcombNoise_groupcombId;
        }
      }
    })
    return {checked, groupcombId};
  }

  findCombMusicData = async (musicInfo: any, groupcombId: number) => {
    return await this.groupcombMusicRepository
    .createQueryBuilder('groupcombMusic')
    .select("groupcombMusic")
    .where("groupcombMusic.groupcombId = :groupcombId", { groupcombId: groupcombId })
    .andWhere("groupcombMusic.musicUrl = :musicUrl", {musicUrl: musicInfo.url})
    .getMany();
  }

  findNoiseVolumeNoiseId = async (noiseNames: string[]) => {
    const findNoiseId = await this.noiseRepository
    .createQueryBuilder('noise')
    .select("noise")
    .where("noise.name IN (:...name)", { name: noiseNames })
    .getMany();
    
    return findNoiseId;
  }

  findWeatherId = async (weather: string) => {
    const findWeatherData =  await this.weatherRepository
    .createQueryBuilder('weather')
    .select("weather")
    .where("weather.weather = :weather", { weather })
    .getMany();

    return findWeatherData[0].id;
  }

  findGroupId = async (groupname: string, userId: number) => {
    const findGroupData =  await this.groupRepository
    .createQueryBuilder("group")
    .select("group")
    .where("group.groupname = :groupname", { groupname })
    .andWhere("group.userId = :userId", { userId })
    .getMany();
    
    return findGroupData[0].id
  }

  findUserGroupName = async (groupname: string, userId: number) => {
    return await this.groupRepository
    .createQueryBuilder('group')
    .select("group")
    .where("group.groupname = :groupname", {groupname })
    .andWhere("group.userId = :userId", {userId})
    .getMany();
  }

  saveGroupcombNoise = async (noiseId: number[], groupcombId: number) => {
    let values = [];
    
    for (let i = 0; i < noiseId.length; i++) {
      let obj: GroupcombNoiseIdDto = { noise: noiseId[i], groupcombId};

      values.push(obj);
    }
    // 그룹 저장
    await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Groupcomb_noise)
    .values(values)
    .execute();
  }

  saveGroupcombMusic = async (musicInfo: any, groupcombId: number) => {
    // groupcombId로 Groupcomb_music 엔티티 db 조회
    // 없다면 빈배열 리턴
    const findGroupcombMusicData = await this.findCombMusicData(musicInfo, groupcombId);
    let groupcombMusicId;
    // musicUrl과 groupcombId가 같은 데이터가 있다면 count + 1 
    if (!findGroupcombMusicData.length) {
       // 데이터가 없는 경우 생성
      await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Groupcomb_music)
      .values([{groupcombId, musicUrl: musicInfo.url}])
      .execute();

      const findNewCombMusicData = await this.findCombMusicData(musicInfo, groupcombId);
      groupcombMusicId = findNewCombMusicData[0].id;
    } else {
      // musicUrl과 groupcombId가 같은 데이터가 있다면 count++;
      groupcombMusicId = findGroupcombMusicData[0].id;

      await getConnection()
      .createQueryBuilder()
      .update(Groupcomb_music)
      .set({
        count: () => "count + 1"
      })
      .where("groupcombId = :groupcombId", {groupcombId})
      .andWhere("musicUrl = :musicUrl", {musicUrl: musicInfo.url})
      .execute();
    }
    return groupcombMusicId;
  }

  saveGroup = async (group: CreateGroupDto, groupcombMusicId: number) => {
    // weather에서 아이디 찾아 저장
    const groupname = group.groupName;
    const userId = group.userId;
    const weather = group.weather;
    const weatherId = await this.findWeatherId(weather);
    
    await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Group)
    .values([{groupname, userId, weatherId, groupcombMusicId}])
    .execute();

    const groupId = await this.findGroupId(groupname, userId);
    
    return groupId;
  }

  saveMusicVolume = async (musicInfo: any, groupId: number) => {
    const musicUrl = musicInfo.url;
    const volume = musicInfo.volume;
    
    await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Music_volume)
    .values([{musicUrl, volume, groupId}])
    .execute();
  }

  saveNoiseVolume = async (noises: any[], groupId: number | string) => {
    if (typeof groupId === "number") {
      let noiseNameList = [];
      
      await noises.forEach((el) => {
        noiseNameList.push(el.name);
      });

      const noiseDatas = await this.findNoiseVolumeNoiseId(noiseNameList);
      let values = [];

      // el.name과 같은 noises[i]에서 volume을 찾고 obj에 저장 
      for (let i = 0; i < noiseDatas.length; i++) {
        let obj;
        for (let j = 0; j < noises.length; j++) {
          if (noiseDatas[i].name === noises[j].name) {
            obj = {noiseId : noiseDatas[i].id, volume: noises[j].volume, groupId};
            values.push(obj);
          }
        }
      }
      
      await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Noise_volume)
      .values(await values)
      .execute();
    }
  }

  findAllGroups = async (userId: number, token: string | undefined) => {
    if (!token) {
      return "유효하지 않은 토큰입니다!";
    }

    const leftJoinGroupDatas = await getManager()
    .createQueryBuilder(Group, 'group')
    .addSelect('group.id')
    .addSelect('weather.weather')
    .addSelect('musicVolume.musicUrl')
    .addSelect('musicVolume.volume')
    .addSelect("noiseVolume.volume")
    .addSelect('noise.name')
    .addSelect('noise.url')
    .leftJoin(User, 'user', 'group.userId = user.id')
    .leftJoin(Weather, 'weather', 'group.weatherId = weather.id')
    .leftJoin(Music_volume, 'musicVolume', 'group.id = musicVolume.groupId')
    .leftJoin(Noise_volume, 'noiseVolume', 'group.id = noiseVolume.groupId')
    .leftJoin(Noise, 'noise', 'noise.id = noiseVolume.noiseId')
    .where(`user.id = ${userId}`)
    .getRawMany()
    
    if (!leftJoinGroupDatas.length) {
      return "저장된 그룹이 없는 유저!";
    }

    let groupsList = [];
    let checkedGroupName = [];

    for (let data of leftJoinGroupDatas) {
      let groupName = data.group_groupname;
      let weather = data.weather_weather;
      let music = { url: data.musicVolume_musicUrl, volume: data.musicVolume_volume}
      let noises = [];

      if (checkedGroupName.indexOf(groupName) === -1) {
        checkedGroupName.push(groupName);

        groupsList.push({ groupName, weather, music, noises });
      }
    }
    
    for (let i = 0; i <groupsList.length; i++) {
      for (let data of leftJoinGroupDatas) {
        if (groupsList[i].groupName === data.group_groupname) {
          let name = data.noise_name;
          let url = data.noise_url;
          let volume = data.noiseVolume_volume;

          groupsList[i].noises.push({name, url, volume})
        }
      }
    }
    return groupsList;
  }

  deleteGroupRequest = async (groupId: number, token: string | undefined) => {
    if (!token) {
      "유효하지 않은 토큰입니다!"
    }
    const groupcombMusicId = (await this.findGroupcombMusicIdInGroup(groupId)).groupcombMusicId;
    
    await this.deleteNoiseVolumeAndMusicVolume(groupId);
    await this.deleteGroup(groupId);
    await this.deleteGroupcombMusicOrgroupcombNoiseOrUncount(groupcombMusicId);

    return "그룹 삭제 완료!"
  }

  deleteNoiseVolumeAndMusicVolume = async (groupId: number) => {
    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Noise_volume)
    .where("groupId = :groupId", { groupId })
    .execute();

    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Music_volume)
    .where("groupId = :groupId", { groupId })
    .execute();
  }

  deleteGroup = async (id: number) => {
    // 지우기 전에 그룹콤브 뮤직 아이디 저장
    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Group)
    .where("id = :id", { id })
    .execute();
  }

  findGroupcombMusicIdInGroup = async (groupId: number): Promise<any> => {
    return await this.groupRepository
    .createQueryBuilder('group')
    .select("group.groupcombMusicId")
    .where("group.id = :groupId", { groupId })
    .getOne();
  }

  deleteGroupcombMusicOrgroupcombNoiseOrUncount = async (combMusicId: number) => {
    const data = await this.groupcombMusicRepository
    .createQueryBuilder('groupcombMusic')
    .select(["groupcombMusic.count", "groupcombMusic.groupcombId"])
    .where("groupcombMusic.id = :combMusicId", { combMusicId })
    .getOne();
    
    let count = data.count;
    let groupcombId = data.groupcombId;

    if (count === 1) {
      await this.deleteGroupcombMusic(combMusicId);
      await this.deleteGroupcombNoise(groupcombId);
    } else {
      await this.uncountGroupcombMusic(combMusicId);
    }
  }

  deleteGroupcombMusic = async (id: number) => {
    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Groupcomb_music)
    .where("id = :id", { id })
    .execute();
  }
  
  deleteGroupcombNoise = async (groupcombId: number) => {
    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Groupcomb_noise)
    .where("groupcombId = :groupcombId", { groupcombId })
    .execute();
  }

  uncountGroupcombMusic = async (id: number) => {
    await getConnection()
    .createQueryBuilder()
    .update(Groupcomb_music)
    .set({
      count: () => "count - 1"
    })
    .where("id = :id", {id})
    .execute();
  }
}