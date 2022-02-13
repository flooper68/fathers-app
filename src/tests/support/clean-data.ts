import mongoose from 'mongoose';

import { getApplicationConfig } from '../../server/application-config';

const collections = [
  'roasting-news',
  'roasting-settings-news',
  'warehouse-roasted-coffee-news',
  'warehouse-roasted-coffee-projection-news',
  'event-streams',
];

export const cleanUpData = async () => {
  const applicationConfig = getApplicationConfig();

  await mongoose.connect(
    `mongodb://${applicationConfig.dbUsername}:${applicationConfig.dbPassword}@${applicationConfig.dbHost}:${applicationConfig.dbPort}/${applicationConfig.dbName}?authSource=${applicationConfig.authenticationDbName}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  await Promise.all(
    collections.map(async (collection) => {
      try {
        await mongoose.connection.collection(collection).drop();
        // eslint-disable-next-line no-empty
      } catch (e) {}
    })
  );
};
