import { DynamicModule, Module } from '@nestjs/common';

import { AggregateRootStore } from './aggreagte-root-store';
import { ApplicationConfigService } from './application-config';
import { ApplicationConfigToken } from './di-tokens';
import { EventOutbox } from './event-outbox';
import { MessageBroker } from './message-broker';

@Module({})
export class CommonModule {
  static configure = <T extends () => unknown>(config: {
    getApplicationConfig: T;
  }): DynamicModule => {
    const contextConfigProvider = {
      provide: ApplicationConfigToken,
      useValue: config.getApplicationConfig,
    };

    return {
      module: CommonModule,
      providers: [
        ApplicationConfigService,
        contextConfigProvider,
        AggregateRootStore,
        EventOutbox,
        MessageBroker,
      ],
      exports: [
        ApplicationConfigService,
        AggregateRootStore,
        EventOutbox,
        MessageBroker,
      ],
    };
  };
}
