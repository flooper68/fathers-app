import mongoose from 'mongoose';

import { getApplicationConfig } from '../../server/application-config';

export const cleanUpData = async () => {
  const applicationConfig = getApplicationConfig();

  await mongoose.connect(
    `mongodb://${applicationConfig.dbUsername}:${applicationConfig.dbPassword}@${applicationConfig.dbHost}:${applicationConfig.dbPort}/${applicationConfig.dbName}?authSource=${applicationConfig.authenticationDbName}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  try {
    await mongoose.connection
      .collection('warehouse-roasted-coffee-news')
      .drop();
    // eslint-disable-next-line no-empty
  } catch (e) {}
  try {
    await mongoose.connection
      .collection('warehouse-roasted-coffee-projection-news')
      .drop();
    // eslint-disable-next-line no-empty
  } catch (e) {}
  try {
    await mongoose.connection.collection('event-streams').drop();
    // eslint-disable-next-line no-empty
  } catch (e) {}
};
