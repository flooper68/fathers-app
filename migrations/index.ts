import { mongoMigrateCli } from 'mongo-migrate-ts';

import { config } from 'dotenv';

config();

mongoMigrateCli({
  uri: `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}`,
  database: 'fathers',
  migrationsDir: __dirname,
  migrationsCollection: 'migrations_collection',
  options: {
    useUnifiedTopology: true,
  },
});
