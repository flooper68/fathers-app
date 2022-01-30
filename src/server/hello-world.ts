import mongoose from 'mongoose';
import { v4 } from 'uuid';

import { Logger } from '../shared/logger';
import { getApplicationContext } from './app-context';
import { withAwaitedEllapsedTime } from './modules/common/with-ellapsed-time';
import { runPromisesInSequence } from './services/promise-utils';

const bootstrap = async () => {
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
    await mongoose.connection.collection('hello-worlds').drop();
    // eslint-disable-next-line no-empty
  } finally {
  }

  Logger.info('Db connected');

  const handleFlow = async (jobs: number) => {
    const uuid = v4();

    await context.helloWorldFeature.createHelloWorld({
      uuid,
      correlationUuid: v4(),
    });

    await Promise.all(
      Array(jobs)
        .fill(1)
        .map(() =>
          context.helloWorldFeature.changeHelloWorld({
            uuid,
            correlationUuid: v4(),
          })
        )
    );

    const result = await context.helloWorldFeature.getHelloWorld({
      uuid,
      correlationUuid: v4(),
    });

    Logger.info(`Result`, result);
    if (result?.count !== jobs) {
      throw new Error(`Wrong count`);
    }
  };

  const handleFlowInSequence = async (jobs: number) => {
    const uuid = v4();

    await context.helloWorldFeature.createHelloWorld({
      uuid,
      correlationUuid: v4(),
    });

    await runPromisesInSequence(Array(jobs).fill(1), async () => {
      await context.helloWorldFeature.changeHelloWorld({
        uuid,
        correlationUuid: v4(),
      });
    });

    const result = await context.helloWorldFeature.getHelloWorld({
      uuid,
      correlationUuid: v4(),
    });

    Logger.info(`Result`, result);
    if (result?.count !== jobs) {
      throw new Error(`Wrong count`);
    }
  };

  const work = withAwaitedEllapsedTime(
    () =>
      Promise.all(
        Array(1)
          .fill(1)
          .map(() => handleFlow(50))
      ),
    'Total time'
  );

  await work();

  // consumer.listen();
  Logger.info(`Finish`);
};

bootstrap();
