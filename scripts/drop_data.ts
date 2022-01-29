import mongoose from 'mongoose';
import { config } from 'dotenv';

import { Logger } from '../src/shared/logger';

config();

Logger.info(`Stargin to drop data`);

mongoose
  .connect(
    `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_DATABASE_NAME}?authSource=${process.env.MONGO_DB_AUTHENTICATION_DATABASE_NAME}`,
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
