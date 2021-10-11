import { MigrationInterface } from 'mongo-migrate-ts';
import { Db } from 'mongodb';

export class MyMigration implements MigrationInterface {
  async up(db: Db): Promise<void> {
    await db.collection('orders').updateMany({}, [{ $unset: 'roasted' }]);
  }

  async down(db: Db): Promise<void> {
    await db.dropCollection('my_collection');
  }
}
