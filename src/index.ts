import 'reflect-metadata';
import { createConnection } from 'typeorm';
// import { Noise } from './entity/Noise.entity';

createConnection()
  .then(async (connection) => {
    // console.log("Inserting a new user into the database...");
    // const user = new User();
    // user.email = "@naver.com";
    // user.oauth = "ksdfksd";
    // user.profile = "png";
    // await connection.manager.save(user);
    // console.log("Saved a new user with id: " + user.id);
    // console.log("Loading users from the database...");
    // const users = await connection.manager.find(User);
    // console.log("Loaded groups: ", users);
    // const group = new Group();
    // group.groupname = "test";
    // group.userId = 1;
    // group.groupcomb_music = 12;
    // group.weathers_id = 1111;
    // await connection.manager.save(user);
    // const groups = await connection.manager.find(Group);
    // console.log("Loaded groups: ", groups);
    // console.log("Here you can setup and run express/koa/any other framework.");
    // let noiseRepository = connection.getRepository(Noise);
    // let checkedNoises = await noiseRepository.find();
    // noise 데이터가 없을 경우만 실행
    // if (checkedNoises.length === 0) {
    //   // console.log(checkedNoises);
    //   const rainNoise = new Noise();
    //   rainNoise.id = 1;
    //   rainNoise.name = 'rain';
    //   rainNoise.url = '226690288';
    //   rainNoise.groupcomb_noises = null;
    //   await noiseRepository.save(rainNoise);
    //   console.log('rainNoise가 저장');
    //   const waveNoise = new Noise();
    //   waveNoise.id = 2;
    //   waveNoise.name = 'wave';
    //   waveNoise.url = '326702198';
    //   waveNoise.groupcomb_noises = null;
    //   await noiseRepository.save(waveNoise);
    //   const campfireNoise = new Noise();
    //   campfireNoise.id = 3;
    //   campfireNoise.name = 'campfire';
    //   campfireNoise.url = '13285945';
    //   campfireNoise.groupcomb_noises = null;
    //   await noiseRepository.save(campfireNoise);
    //   const driveNoise = new Noise();
    //   driveNoise.id = 4;
    //   driveNoise.name = 'drive';
    //   driveNoise.url = '648410951';
    //   driveNoise.groupcomb_noises = null;
    //   await noiseRepository.save(driveNoise);
    //   const nightNoise = new Noise();
    //   nightNoise.id = 5;
    //   nightNoise.name = 'night';
    //   nightNoise.url = '366135758';
    //   nightNoise.groupcomb_noises = null;
    //   await noiseRepository.save(nightNoise);
    //   let savedNoises = await noiseRepository.find();
    //   console.log('저장된 모든 노이즈들', savedNoises);
    // } else console.log(checkedNoises);
  })
  .catch((error) => console.log(error));
