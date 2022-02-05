import mongoose from 'mongoose';

import { getApplicationContext } from '../../server/app-context';

export const cleanUpData = async () => {
  const context = await getApplicationContext();
  const applicationConfig = context.applicationConfig.getConfig();

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
    await mongoose.connection.collection('test-consumers').drop();
    // eslint-disable-next-line no-empty
  } catch (e) {}
  try {
    await mongoose.connection.collection('event-streams').drop();
    // eslint-disable-next-line no-empty
  } catch (e) {}
};
