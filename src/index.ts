import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Weather } from './entity/Weather.entity';
// import { Noise } from './entity/Noise.entity';

createConnection()
  .then(async (connection) => {
    let weatherRepository = connection.getRepository(Weather);
    let checkedWeathers = await weatherRepository.find();

    if (!checkedWeathers.length) {
      const breeze = new Weather();
      breeze.id = 1;
      breeze.weather = "breeze";
      await weatherRepository.save(breeze);
  
      const hot = new Weather();
      hot.id = 2;
      hot.weather = "hot";
      await weatherRepository.save(hot);
  
      const snow = new Weather();
      snow.id = 3;
      snow.weather = "snow";
      await weatherRepository.save(snow);
  
      const rain = new Weather();
      rain.id = 4;
      rain.weather = "rain"
      await weatherRepository.save(rain);
    }
  })
  .catch((error) => console.log(error));
