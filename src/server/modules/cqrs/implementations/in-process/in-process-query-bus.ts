import { Inject, Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import 'reflect-metadata';

import { Logger } from '../../../../../shared/logger';
import { InfrastructureError } from '../../../common/errors';
import { QueryBus } from '../../buses/query-bus';
import {
  ContextConfig,
  isMaster,
  isWorker,
} from '../../config/cqrs-context-config';
import {
  QueryHandlerMetadata,
  getQueryHandlerMetadata,
  IQuery,
  IQueryHandler,
} from '../../decorators/query-handler.decorator';
import { CqrsContextConfigToken } from '../../di-tokens';
import {
  InvalidQueryHandlerException,
  QueryHandlerExistsException,
} from '../../errors/cqrs-errors';

// TODO better typing
export type QueryHandlerType = Type<IQueryHandler<IQuery<unknown, any>, any>>;

@Injectable()
export class InProcessQueryBus implements QueryBus {
  private _handlers = new Map<
    string,
    {
      instance: IQueryHandler<IQuery, unknown>;
      // TODO improve typing if possible
      metadata: QueryHandlerMetadata<any, any>;
    }
  >();

  constructor(
    private readonly moduleRef: ModuleRef,
    @Inject(CqrsContextConfigToken)
    private readonly contextConfig: ContextConfig
  ) {
    if (isMaster(this.contextConfig) && !this.contextConfig.processJobs) {
      throw new InfrastructureError(
        `InProcessQueryBus does needs processJobs option toggled for master application`
      );
    }

    if (isWorker(this.contextConfig)) {
      throw new InfrastructureError(
        `InProcessQueryBus is not supported for workers`
      );
    }

    Logger.info(
      `Initializing InProcessQueryBus, all queries will be handled in the main process, there are no separate workers.`
    );
  }

  async execute<TResult>(query: IQuery<unknown, any>): Promise<TResult> {
    Logger.debug(`Dispatching query ${query.type}`);
    const start = Date.now();

    const result = (await this.processQuery(query)) as TResult;

    Logger.debug(
      `Query ${query.type} finished, it took ${Date.now() - start} ms`
    );
    return result;
  }

  register(handlers: QueryHandlerType[] = []) {
    Logger.info(
      `Registering query handlers ${handlers.map((item) => item.name)}`
    );
    handlers.forEach((handler) => this.registerHandler(handler));
  }

  protected registerHandler(handler: QueryHandlerType) {
    const instance = this.moduleRef.get(handler, { strict: false });

    if (!instance) {
      throw new InvalidQueryHandlerException();
    }

    const metadata = getQueryHandlerMetadata(handler);

    if (!metadata.query) {
      throw new InvalidQueryHandlerException();
    }

    if (this._handlers.get(metadata.query.name)) {
      throw new QueryHandlerExistsException(metadata.query.name);
    }

    Logger.info(
      `Subscribing query handler ${handler.name} to query ${metadata.query.name}`
    );
    this._handlers.set(metadata.query.name, { instance, metadata });
  }

  private processQuery = (query: IQuery): Promise<unknown> => {
    const handler = this._handlers.get(query.constructor.name);

    if (!handler) {
      //TODO more expressive errors
      throw new Error(`No handler found for query ${query.constructor.name}`);
    }

    return handler.instance.execute(query);
  };
}
