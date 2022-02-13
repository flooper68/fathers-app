import { INestApplication, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';

import { HelloWorldModule } from './modules/hello-world/hello-world.module';
import { Logger } from '../shared/logger';
import { ApplicationConfig, getApplicationConfig } from './application-config';
import { ApplicationConfigService } from './modules/common/application-config';
import { CqrsModule } from './modules/cqrs/cqrs.module';
import { HelloWorldFeature } from './modules/hello-world/hello-world-feature';
import { MessageBroker } from './modules/common/message-broker';
import { EventOutbox } from './modules/common/event-outbox';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { WarehouseRoastedCoffeeFeature } from './modules/warehouse/features/warehouse-roasted-coffee-features';
import { WarehouseResolver } from './api/warehouse-resolver';
import { RoastingModule } from './modules/roasting/roasting.module';
import { RoastingSettingsResolver } from './api/roasting-settings-resolver';
import { RoastingResolver } from './api/roasting-resolver';

export interface AppContext {
  application: INestApplication;
  applicationConfig: ApplicationConfigService<ApplicationConfig>;
  helloWorldFeature: HelloWorldFeature;
  messageBroker: MessageBroker;
  eventOutbox: EventOutbox;
  warehouseRoastedCoffeeFeature: WarehouseRoastedCoffeeFeature;
}

const contextModule = CqrsModule.configure({
  getApplicationConfig,
  contextConfig: {
    master: true,
    processJobs: true,
  },
});

@Module({
  imports: [
    HelloWorldModule.configure(contextModule),
    WarehouseModule.configure(contextModule),
    RoastingModule.configure(contextModule),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      path: '/api/graphql',
    }),
  ],
  providers: [WarehouseResolver, RoastingSettingsResolver, RoastingResolver],
})
export class AppModule {}

export const getApplicationContext = async (): Promise<AppContext> => {
  const appContext = await NestFactory.create(AppModule, {
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
  const warehouseRoastedCoffeeFeature = await appContext.resolve(
    WarehouseRoastedCoffeeFeature
  );

  return {
    application: appContext,
    applicationConfig,
    helloWorldFeature,
    messageBroker,
    eventOutbox,
    warehouseRoastedCoffeeFeature,
  };
};
