import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getRepository, Repository } from 'typeorm';
import { Group } from 'src/entity/Group.entity';
import { User } from 'src/entity/User.entity';
import { Weather } from 'src/entity/Weather.entity';
import { Noise_volume } from 'src/entity/Noise_volume.entity';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

@Injectable()
export class RecommendService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Weather)
    private weatherRepository: Repository<Weather>,
  ) {}

  async getOthers(userId) {
    const user = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .getOne();
    if (!user) {
      return {
        message: '존재하지 않는 유저 정보!',
      };
    } else {
      const others = await getRepository(Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.groupcombMusic', 'groupcombMusic')
        .leftJoinAndSelect('group.weather', 'weather')
        .leftJoinAndSelect('group.user', 'user')
        .select('user.id')
        .addSelect('user.email')
        .addSelect('weather.weather')
        .addSelect('groupcombMusic.musicUrl')
        .addSelect('group.groupname')
        .where('group.userId = :userId', { userId: userId })
        .getMany()
        .then(async (data) => {
          for (let i = 0; i < data.length; i++) {
            const noise = await getRepository(Noise_volume)
              .createQueryBuilder('noiseVolume')
              .innerJoinAndSelect('noiseVolume.noise', 'noise')
              .select('noise.name')
              .addSelect('noiseVolume.volume')
              .where('noiseVolume.groupId = :groupId', {
                groupId: data[i].user.id,
              })
              .getMany();
            data[i]['noise'] = noise;
          }
          return data;
        });
      return {
        data: others,
        message: '해당 유저의 그룹을 성공적으로 불러왔습니다!',
      };
    }
  }

  async getRecommend() {
    const api = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&units=metric&appid=${process.env.WEATHERAPI_KEY}`,
    ).then((res) => {
      return res.json();
    });

    if (api.weather.main === 'rain') {
      const weatherId = await getRepository(Weather)
        .createQueryBuilder('weather')
        .select('weather.id')
        .where('weather.weather = :weather', { weather: 'rain' })
        .getOne()
        .then((data) => {
          return data.id;
        });

      const weatherRecommend = await getRepository(Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.groupcombMusic', 'groupcombMusic')
        .leftJoinAndSelect('group.weather', 'weather')
        .leftJoinAndSelect('group.user', 'user')
        .select('user.id')
        .addSelect('user.email')
        .addSelect('weather.weather')
        .addSelect('groupcombMusic.musicUrl')
        .addSelect('group.groupname')
        .where('group.weatherId = :weatherId', { weatherId: weatherId })
        .getMany()
        .then(async (data) => {
          for (let i = 0; i < data.length; i++) {
            const noise = await getRepository(Noise_volume)
              .createQueryBuilder('noiseVolume')
              .innerJoinAndSelect('noiseVolume.noise', 'noise')
              .select('noise.name')
              .addSelect('noiseVolume.volume')
              .where('noiseVolume.groupId = :groupId', {
                groupId: data[i].user.id,
              })
              .getMany();
            data[i]['noise'] = noise;
          }
          return data;
        });
      return weatherRecommend;
    } else if (api.main.temp < 10) {
      const weatherId = await getRepository(Weather)
        .createQueryBuilder('weather')
        .select('weather.id')
        .where('weather.weather = :weather', { weather: 'snow' })
        .getOne()
        .then((data) => {
          return data.id;
        });

      const weatherRecommend = await getRepository(Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.groupcombMusic', 'groupcombMusic')
        .leftJoinAndSelect('group.weather', 'weather')
        .leftJoinAndSelect('group.user', 'user')
        .select('user.id')
        .addSelect('user.email')
        .addSelect('weather.weather')
        .addSelect('groupcombMusic.musicUrl')
        .addSelect('group.groupname')
        .where('group.weatherId = :weatherId', { weatherId: weatherId })
        .getMany()
        .then(async (data) => {
          for (let i = 0; i < data.length; i++) {
            const noise = await getRepository(Noise_volume)
              .createQueryBuilder('noiseVolume')
              .innerJoinAndSelect('noiseVolume.noise', 'noise')
              .select('noise.name')
              .addSelect('noiseVolume.volume')
              .where('noiseVolume.groupId = :groupId', {
                groupId: data[i].user.id,
              })
              .getMany();
            data[i]['noise'] = noise;
          }
          return data;
        });
      return weatherRecommend;
    } else if (30 < api.main.temp) {
      const weatherId = await getRepository(Weather)
        .createQueryBuilder('weather')
        .select('weather.id')
        .where('weather.weather = :weather', { weather: 'hot' })
        .getOne()
        .then((data) => {
          return data.id;
        });

      const weatherRecommend = await getRepository(Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.groupcombMusic', 'groupcombMusic')
        .leftJoinAndSelect('group.weather', 'weather')
        .leftJoinAndSelect('group.user', 'user')
        .select('user.id')
        .addSelect('user.email')
        .addSelect('weather.weather')
        .addSelect('groupcombMusic.musicUrl')
        .addSelect('group.groupname')
        .where('group.weatherId = :weatherId', { weatherId: weatherId })
        .getMany()
        .then(async (data) => {
          for (let i = 0; i < data.length; i++) {
            const noise = await getRepository(Noise_volume)
              .createQueryBuilder('noiseVolume')
              .innerJoinAndSelect('noiseVolume.noise', 'noise')
              .select('noise.name')
              .addSelect('noiseVolume.volume')
              .where('noiseVolume.groupId = :groupId', {
                groupId: data[i].user.id,
              })
              .getMany();
            data[i]['noise'] = noise;
          }
          return data;
        });
      return weatherRecommend;
    } else {
      const weatherId = await getRepository(Weather)
        .createQueryBuilder('weather')
        .select('weather.id')
        .where('weather.weather = :weather', { weather: 'breeze' })
        .getOne()
        .then((data) => {
          return data.id;
        });

      const weatherRecommend = await getRepository(Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.groupcombMusic', 'groupcombMusic')
        .leftJoinAndSelect('group.weather', 'weather')
        .leftJoinAndSelect('group.user', 'user')
        .select('user.id')
        .addSelect('user.email')
        .addSelect('weather.weather')
        .addSelect('groupcombMusic.musicUrl')
        .addSelect('group.groupname')
        .where('group.weatherId = :weatherId', { weatherId: weatherId })
        .getMany()
        .then(async (data) => {
          for (let i = 0; i < data.length; i++) {
            const noise = await getRepository(Noise_volume)
              .createQueryBuilder('noiseVolume')
              .innerJoinAndSelect('noiseVolume.noise', 'noise')
              .select('noise.name')
              .addSelect('noiseVolume.volume')
              .where('noiseVolume.groupId = :groupId', {
                groupId: data[i].user.id,
              })
              .getMany();
            data[i]['noise'] = noise;
          }
          return data;
        });
      return weatherRecommend;
    }
  }
}
