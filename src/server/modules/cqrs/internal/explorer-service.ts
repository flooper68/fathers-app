import { Injectable, Type } from '@nestjs/common';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module } from '@nestjs/core/injector/module';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';

import {
  ICommandHandler,
  ICommand,
  COMMAND_HANDLER_METADATA,
} from '../decorators/command-handler.decorator';
import {
  IEventsHandler,
  IEvent,
  EVENTS_HANDLER_METADATA,
} from '../decorators/events-handler.decorator';
import {
  IQueryHandler,
  IQuery,
  QUERY_HANDLER_METADATA,
} from '../decorators/query-handler.decorator';
import { SAGA_METADATA } from '../decorators/saga.decorator';

export interface CqrsOptions {
  // TODO can we improve typing here?
  events?: Type<IEventsHandler<any>>[];
  commands?: Type<ICommandHandler<ICommand<any>>>[];
  queries?: Type<IQueryHandler<IQuery<any>, any>>[];
  sagas?: Type<any>[];
}

@Injectable()
export class ExplorerService<EventBase extends IEvent = IEvent> {
  constructor(private readonly modulesContainer: ModulesContainer) {}

  explore(): CqrsOptions {
    const modules = [...this.modulesContainer.values()];
    const commands = this.flatMap<ICommandHandler<any>>(modules, (instance) =>
      this.filterProvider(instance, COMMAND_HANDLER_METADATA)
    );

    const queries = this.flatMap<IQueryHandler<any, any>>(modules, (instance) =>
      this.filterProvider(instance, QUERY_HANDLER_METADATA)
    );

    const events = this.flatMap<IEventsHandler<EventBase>>(
      modules,
      (instance) => this.filterProvider(instance, EVENTS_HANDLER_METADATA)
    );
    const sagas = this.flatMap(modules, (instance) =>
      this.filterProvider(instance, SAGA_METADATA)
    );
    return { commands, events, queries, sagas };
  }

  flatMap<T>(
    modules: Module[],
    callback: (instance: InstanceWrapper) => Type<any> | undefined
  ): Type<T>[] {
    const items = modules
      .map((module) => [...module.providers.values()].map(callback))
      .reduce((a, b) => a.concat(b), []);
    return items.filter((element) => !!element) as Type<T>[];
  }

  filterProvider(
    wrapper: InstanceWrapper,
    metadataKey: string
  ): Type<any> | undefined {
    const { instance } = wrapper;
    if (!instance) {
      return undefined;
    }
    return this.extractMetadata(instance, metadataKey);
  }

  extractMetadata(
    instance: Record<string, any>,
    metadataKey: string
  ): Type<any> | undefined {
    if (!instance.constructor) {
      return;
    }
    const metadata = Reflect.getMetadata(metadataKey, instance.constructor);
    return metadata ? (instance.constructor as Type<any>) : undefined;
  }
}
