import 'reflect-metadata';

export const QUERY_HANDLER_METADATA = '__queryHandler__';

// TODO do we need any here??
export interface IQuery<Payload = unknown, Type extends string = any> {
  readonly type: Type;
  readonly payload: Payload;
}

//TODO correlationUuid handling needs more love, it is kind of awkward right now
export interface QueryProps {
  readonly correlationUuid: string;
}

export interface IQueryHandler<Query extends IQuery, TResult> {
  execute(command: Query): Promise<TResult>;
}

export interface QueryHandlerMetadata<T extends IQuery, P extends QueryProps> {
  query: new (props: P) => T;
  queue?: string | { name: string; resolveResource: (query: T) => string };
}

export const QueryHandler = <T extends IQuery, P extends QueryProps>(
  config: QueryHandlerMetadata<T, P>
): ClassDecorator => {
  return (commandHandler) => {
    const metadata: QueryHandlerMetadata<T, P> = config;
    Reflect.defineMetadata(QUERY_HANDLER_METADATA, metadata, commandHandler);
  };
};

export const getQueryHandlerMetadata = <
  C extends IQuery,
  R,
  T extends IQueryHandler<C, R>,
  P extends QueryProps
>(
  commandHandler: new (...args: unknown[]) => T
): QueryHandlerMetadata<C, P> => {
  return Reflect.getMetadata(QUERY_HANDLER_METADATA, commandHandler);
};
