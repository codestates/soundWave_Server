import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Group } from '../entity/Group.entity';

export default class CreateNoises implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Group)
      .values([
        {
          groupname: '가을밤',
          user: { id: 1 },
          weather: { id: 1 },
          groupcomb_music: { id: 2 },
        },
        {
          groupname: '여름날',
          user: { id: 1 },
          weather: { id: 2 },
          groupcomb_music: { id: 1 },
        },
        {
          groupname: '겨울호수',
          user: { id: 2 },
          weather: { id: 3 },
          groupcomb_music: { id: 3 },
        },
        {
          groupname: '깊은밤',
          user: { id: 2 },
          weather: { id: 4 },
          groupcomb_music: { id: 4 },
        },
      ])
      .execute();
  }
}
