import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { HelloWorldModule } from './modules/hello-world/hello-world.module';
import { Logger } from '../shared/logger';
import { ApplicationConfig, getApplicationConfig } from './application-config';
import { ApplicationConfigService } from './modules/common/application-config';
import { CqrsModule } from './modules/cqrs/cqrs.module';
import { HelloWorldFeature } from './modules/hello-world/hello-world-feature';
import { MessageBroker } from './modules/common/message-broker';
import { EventOutbox } from './modules/common/event-outbox';

export interface AppContext {
  applicationConfig: ApplicationConfigService<ApplicationConfig>;
  helloWorldFeature: HelloWorldFeature;
  messageBroker: MessageBroker;
  eventOutbox: EventOutbox<any>;
}

const contextModule = CqrsModule.configure({
  getApplicationConfig,
  contextConfig: {
    master: true,
    processJobs: true,
  },
});

@Module({
  imports: [HelloWorldModule.configure(contextModule)],
  providers: [],
})
export class AppModule {}

export const getApplicationContext = async (): Promise<AppContext> => {
  const appContext = await NestFactory.createApplicationContext(AppModule, {
    logger: {
      log: Logger.info,
      error: Logger.error,
      warn: Logger.warn,
      debug: Logger.debug,
      verbose: Logger.debug,
    },
  });

  const applicationConfig: ApplicationConfigService<ApplicationConfig> =
    await appContext.resolve(ApplicationConfigService);
  const helloWorldFeature = await appContext.resolve(HelloWorldFeature);
  const messageBroker = await appContext.resolve(MessageBroker);
  const eventOutbox = await appContext.resolve(EventOutbox);

  return { applicationConfig, helloWorldFeature, messageBroker, eventOutbox };
};
