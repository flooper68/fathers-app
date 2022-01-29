import { mongoMigrateCli } from 'mongo-migrate-ts';

import { getApplicationConfig } from '../src/server/application-config';

const applicationConfig = getApplicationConfig();

mongoMigrateCli({
  uri: `mongodb://${applicationConfig.dbUsername}:${applicationConfig.dbPassword}@${applicationConfig.dbHost}:${applicationConfig.dbPort}/${applicationConfig.dbName}?authSource=${applicationConfig.authenticationDbName}`,
  database: 'fathers',
  migrationsDir: __dirname,
  migrationsCollection: 'migrations_collection',
  options: {
    useUnifiedTopology: true,
  },
});
