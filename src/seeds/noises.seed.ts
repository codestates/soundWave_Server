import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Noise } from '../../dist/entity/Noise.entity';

export default class CreateNoises implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Noise)
      .values([
        { name: 'rain', url: '226690288' },
        { name: 'wave', url: '326702198' },
        { name: 'campfire', url: '13285945' },
        { name: 'drive', url: '648410951' },
        { name: 'night', url: '366135758' },
      ])
      .execute();
  }
}
