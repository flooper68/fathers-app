import { Injectable, Type } from '@nestjs/common';
import 'reflect-metadata';

import { IQueryHandler, IQuery } from '../decorators/query-handler.decorator';

// TODO better typing
export type QueryHandlerType = Type<IQueryHandler<IQuery<unknown, any>, any>>;
@Injectable()
export abstract class QueryBus {
  abstract execute<TResult>(query: IQuery<unknown, any>): Promise<TResult>;

  abstract register(handlers: QueryHandlerType[] | undefined): void;
}
