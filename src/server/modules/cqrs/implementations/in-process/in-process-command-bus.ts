import { Injectable, Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import 'reflect-metadata';

import { Logger } from '../../../../../shared/logger';
import { InfrastructureError } from '../../../common/errors';
import { CommandBus } from '../../buses/command-bus';
import { EventBus } from '../../buses/event-bus';
import {
  ContextConfig,
  isMaster,
  isWorker,
} from '../../config/cqrs-context-config';
import {
  CommandHandlerMetadata,
  getCommandHandlerMetadata,
  ICommand,
  ICommandHandler,
} from '../../decorators/command-handler.decorator';
import { IEvent } from '../../decorators/events-handler.decorator';
import { CqrsContextConfigToken } from '../../di-tokens';
import {
  InvalidCommandHandlerException,
  CommandHandlerExistsException,
} from '../../errors/cqrs-errors';

@Injectable()
export class InProcessCommandBus implements CommandBus {
  private _handlers = new Map<
    string,
    {
      instance: ICommandHandler<ICommand>;
      metadata: CommandHandlerMetadata<any, any>;
    }
  >();
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly eventBus: EventBus,
    @Inject(CqrsContextConfigToken)
    private readonly contextConfig: ContextConfig
  ) {
    if (isMaster(this.contextConfig) && !this.contextConfig.processJobs) {
      throw new InfrastructureError(
        `InProcessCommandBus does needs processJobs option toggled for master application`
      );
    }

    if (isWorker(this.contextConfig)) {
      throw new InfrastructureError(
        `InProcessCommandBus is not supported for workers`
      );
    }

    Logger.info(
      `Initializing InProcessCommandBus, all commands will be handled in the main process, there are no separate workers.`
    );
  }

  async execute(command: ICommand<unknown, any>): Promise<void> {
    Logger.debug(`Dispatching command ${command.type}`);
    this.eventBus.publish({
      type: `CommandDispatched/${command.type}`,
      correlationUuid: (command.payload as any)?.correlationUuid,
      payload: undefined,
    } as IEvent);
    const start = Date.now();

    await this.processCommand(command);

    Logger.debug(
      `Command ${command.type} finished, it took ${Date.now() - start} ms`
    );
  }

  register = <T extends ICommandHandler<any>>(
    handlers: (new (payload: unknown) => T)[] = []
  ) => {
    handlers.forEach((handler) => this.registerHandler(handler));
  };

  private registerHandler<T extends ICommandHandler<any>>(
    handler: new (payload: unknown) => T
  ) {
    const instance = this.moduleRef.get(handler, { strict: false });

    if (!instance) {
      throw new InvalidCommandHandlerException();
    }

    const metadata = getCommandHandlerMetadata(handler);

    if (!metadata.command) {
      throw new InvalidCommandHandlerException();
    }

    if (this._handlers.get(metadata.command.name)) {
      throw new CommandHandlerExistsException(metadata.command.name);
    }

    Logger.info(
      `Registering command handler ${handler.name} to command ${metadata.command.name}`
    );

    this._handlers.set(metadata.command.name, { instance, metadata });
  }

  private processCommand = async (command: ICommand): Promise<void> => {
    const handler = this._handlers.get(command.constructor.name);

    if (!handler) {
      //TODO more expressive errors
      throw new Error(
        `No handler found for command ${command.constructor.name}`
      );
    }
    await handler.instance.execute(command);
  };
}
