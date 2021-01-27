import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { GroupcombNoiseIdDto } from './dto/groupcombNoiseIdDto';
import { CreateGroupDto } from './dto/CreateGroupDto';
import { Group } from 'src/entity/Group.entity';
import { Noise } from 'src/entity/Noise.entity';
import { Weather } from 'src/entity/Weather.entity';
import { Groupcomb_noise } from 'src/entity/Groupcomb_noise.entity';
import { Groupcomb_music } from 'src/entity/Groupcomb_music.entity';
import { Music_volume } from 'src/entity/Music_volume.entity';
import { Noise_volume } from 'src/entity/Noise_volume.entity';

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
    
    await group.noises.forEach((noise: any) => {
      noiseNames.push(noise.name);
    });
    
    // noise 배열의 name으로 db내 noiseId를 찾는다
    const findNoiseId: any[] = await this.noiseRepository
    .createQueryBuilder('noise')
    .select("noise.id")
    .where("noise.name IN (:...name)", { name: noiseNames })
    .getMany()

    console.log(findNoiseId)
    //[ Noise { id: 1 }, Noise { id: 2 } ]
    let noiseId = [];

    await findNoiseId.forEach((el: any) => {
      noiseId.push(el.id);
    });

    const noiseIdList = await noiseId.join(',');

    // noiseIdList = '1,2';
    console.log(await noiseIdList)
    
    const groupNoise = await this.groupcombNoiseRepository
    .createQueryBuilder('groupcombNoise')
    .select(['GROUP_CONCAT(groupcombNoise.noiseId)', 'groupcombNoise.groupcombId'])
    .groupBy('groupcombNoise.groupcombId')
    .getRawMany();
    
    console.log(await groupNoise);
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
      console.log(await findLastCombId[lastCombIdKey]);
      findLastCombIdTask.groupcombId = findLastCombId[lastCombIdKey] + 1;
      
      // groupcomb_noise 엔티티에 db를 저장
      await this.saveGroupcombNoise(noiseId, findLastCombIdTask.groupcombId);
    }
    
    // Groupcomb_music 엔티티에 db 저장
    const groupcombMusicId = await this.saveGroupcombMusic(group.music, findLastCombIdTask.groupcombId);
      // SELECT groupcombId, GROUP_CONCAT(noiseId) FROM soundwave.groupcomb_noise GROUP BY groupcombId;
    const checkedGroup = await this.saveGroup(group, groupcombMusicId);

    if (typeof checkedGroup === "string") {
      // 동일한 그룹네임이 있는 경우
      return checkedGroup; // 에러 문구 리턴
    } else {
      // 정상 groupId라면
      const groupId = await checkedGroup;
      await this.saveMusicVolume(group.music, groupId);
      await this.saveNoiseVolume(group.noises, groupId);
      return "그룹 저장 성공!";
    }
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
    console.log( await findNoiseId, '파인드노이즈볼륨노이즈아이디')
    
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
    
    // console.log(noiseId);
    for (let i = 0; i < noiseId.length; i++) {
      let obj: GroupcombNoiseIdDto = { noise: noiseId[i], groupcombId};
      console.log(noiseId[i]);
      values.push(obj);
    }
    // 그룹 저장
    console.log(await values, "!!!!!!")
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
    
    // 해당 유저 아이디로 그룹 네임이 동일하다면 
    const checkedGroupName = await this.findUserGroupName(groupname, userId);

    if (checkedGroupName.length) {
      // 데이터가 있다면, 에러 노출
      return "이미 동일한 이름의 그룹이 존재합니다."

    } else {
      await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Group)
      .values([{groupname, userId, weatherId, groupcombMusicId}])
      .execute();
  
      const groupId = await this.findGroupId(groupname, userId);
      return groupId;
    }
  }

  saveMusicVolume = async (musicInfo: any, groupId: number | string) => {
    const musicUrl = musicInfo.url;
    const volume = musicInfo.volume;
    
    if (typeof groupId === "number") {
      await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Music_volume)
      .values([{musicUrl, volume, groupId}])
      .execute();
    } 
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
}

    // 토큰이 있다면, 저장 진행 

      //- 1 userId로 db 조회 (그룹네임 같은 데이터가 있다면 해당 데이터를 수정해야 함)

      //- 2 noise 배열의 name으로 db내 noiseId를 찾는다
      // ㄴ 1. 
      // ㄴ 2.  Groupcomb_noise 엔티티에서 해당 noiseId가 모두 포함되어있고 groupcombId가 같은 db를 찾는다
      //   ㄴ 존재할 경우 추가 저장 불필요 groupcombId를 변수a에 저장 해놓는다
      //     ㄴ Groupcomb_music db 데이터 추가 !!count를 1 증가시킨다
      
      
      //   ㄴ 존재하지 않는 경우 마지막 groupcombId + 1 한 값을 변수 a에 저장
          // ㄴ groupcomb_noise 엔티티에 db를 저장
          // ㄴ Groupcomb_music 엔티티에 db 저장
      
      
      //- 3 group.weather 로 weather 엔티티 확인
      // ㄴ 일치하는 것을 찾아 weather 엔티티 id를 Group . weather 값에 적용
      // ㄴ 그룹 엔티티 db 추가

      //- 4 뮤직 볼륨, 노이즈 볼륨 db 추가
      
      //

      // 생성 순서
      // 그룹콤보 노이즈 > 그룹콤보 뮤직 > 그룹 > 뮤직 볼륨, 노이즈 볼륨

    // 토큰이 없다면 처리 불가