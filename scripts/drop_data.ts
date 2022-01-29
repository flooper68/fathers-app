import mongoose from 'mongoose';

import { Logger } from '../src/shared/logger';
import { getApplicationConfig } from './../src/server/application-config';

const applicationConfig = getApplicationConfig();

Logger.info(`Starting to drop data`);

mongoose
  .connect(
    `mongodb://${applicationConfig.dbUsername}:${applicationConfig.dbPassword}@${applicationConfig.dbHost}:${applicationConfig.dbPort}/${applicationConfig.dbName}?authSource=${applicationConfig.authenticationDbName}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    Logger.info(`Db connected`);
    mongoose.connection.db.dropDatabase(() => {
      Logger.info(`Drop finished, diconnecting...`);
      mongoose.disconnect();
    });
  });
