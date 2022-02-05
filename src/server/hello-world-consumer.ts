import mongoose from 'mongoose';
import { v4 } from 'uuid';

import { Logger } from '../shared/logger';
import { getApplicationContext } from './app-context';
import { withAwaitedEllapsedTime } from './modules/common/with-ellapsed-time';
import { runPromisesInSequence } from './services/promise-utils';
import { HelloWorldDomainEvent } from './modules/hello-world/hello-world-root';
import { Consumer } from './modules/common/consumer';

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
  } catch (e) {}
  try {
    await mongoose.connection.collection('event-streams').drop();
    // eslint-disable-next-line no-empty
  } catch (e) {}
  try {
    await mongoose.connection.collection('consumers').drop();
    // eslint-disable-next-line no-empty
  } catch (e) {}

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
    let count = 0;

    await context.helloWorldFeature.createHelloWorld({
      uuid,
      correlationUuid: v4(),
    });

    await runPromisesInSequence(Array(jobs).fill(1), async () => {
      await context.helloWorldFeature.changeHelloWorld({
        uuid,
        correlationUuid: v4(),
      });
      count++;
      Logger.debug(`Finished ${count} out of ${jobs}`);
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
          .map(() => handleFlowInSequence(10))
      ),
    'Total time'
  );

  // await work();

  Logger.info(`Finished writing`);

  const reducer = (
    state: Record<string, number>,
    event: HelloWorldDomainEvent
  ) => {
    switch (event.type) {
      case 'HelloWorldCountChanged': {
        return {
          ...state,
          [event.payload.uuid]: (state[event.payload.uuid] || 0) + 1,
        };
      }
      case 'HelloWorldCreated': {
        return {
          ...state,
          [event.payload.uuid]: 0,
        };
      }
      default:
        return state;
    }
  };
  const consumer1 = new Consumer<Record<string, number>, HelloWorldDomainEvent>(
    context.messageBroker,
    {
      name: `consumer-${v4()}`,
      stream: 'stream-1',
      initialState: {},
      reducer,
    }
  );

  consumer1.listen();

  const consumer2 = new Consumer<Record<string, number>, HelloWorldDomainEvent>(
    context.messageBroker,
    {
      name: `consumer-${v4()}`,
      stream: 'stream-2',
      initialState: {},
      reducer,
    }
  );

  consumer2.listen();

  const consumer3 = new Consumer<Record<string, number>, HelloWorldDomainEvent>(
    context.messageBroker,
    {
      name: `consumer-${v4()}`,
      stream: 'stream-3',
      initialState: {},
      reducer,
    }
  );

  consumer3.listen();

  const consumer4 = new Consumer<Record<string, number>, HelloWorldDomainEvent>(
    context.messageBroker,
    {
      name: `consumer-${v4()}`,
      stream: 'stream-4',
      initialState: {},
      reducer,
    }
  );

  consumer4.listen();

  // process.exit();
};

bootstrap();
