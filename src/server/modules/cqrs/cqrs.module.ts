import { DynamicModule, Module, OnApplicationBootstrap } from '@nestjs/common';

import { InProcessQueryBus } from './implementations/in-process/in-process-query-bus';
import { InProcessCommandBus } from './implementations/in-process/in-process-command-bus';
import { CommonModule } from '../common/common-module';
import { CommandBus } from './buses/command-bus';
import { EventBus } from './buses/event-bus';
import { QueryBus } from './buses/query-bus';
import { ContextConfig } from './config/cqrs-context-config';
import { CqrsContextConfigToken } from './di-tokens';
import { ExplorerService } from './internal/explorer-service';
import { Logger } from '../../../shared/logger';
import { InProcessEventBus } from './implementations/in-process/in-process-event-bus';

@Module({})
export class CqrsModule implements OnApplicationBootstrap {
  constructor(
    private readonly explorerService: ExplorerService,
    private readonly eventsBus: EventBus,
    private readonly commandsBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  static configure = <T extends () => unknown>(config: {
    getApplicationConfig: T;
    contextConfig: ContextConfig;
  }): DynamicModule => {
    const contextConfigProvider = {
      provide: CqrsContextConfigToken,
      useValue: config.contextConfig,
    };

    const commandBusProvider = {
      provide: CommandBus,
      useClass: config.contextConfig.cqrs?.CommandBus || InProcessCommandBus,
    };

    const eventBusProvider = {
      provide: EventBus,
      useClass: config.contextConfig.cqrs?.EventBus || InProcessEventBus,
    };

    const queryBusProvider = {
      provide: QueryBus,
      useClass: config.contextConfig.cqrs?.QueryBus || InProcessQueryBus,
    };

    return {
      module: CqrsModule,
      imports: [CommonModule.configure(config)],
      providers: [
        eventBusProvider,
        ExplorerService,
        queryBusProvider,
        contextConfigProvider,
        commandBusProvider,
      ],
      exports: [
        commandBusProvider,
        eventBusProvider,
        queryBusProvider,
        CommonModule,
      ],
    };
  };

  onApplicationBootstrap(): void {
    Logger.info('Bootstrapping cqrs module');
    const { events, sagas, commands, queries } = this.explorerService.explore();

    this.eventsBus.registerHandlers(events);
    this.commandsBus.register(commands);
    this.eventsBus.registerSagas(sagas);
    this.queryBus.register(queries);
  }
}
