import {
  IQuery,
  IQueryHandler,
  QueryHandler,
} from '../cqrs/decorators/query-handler.decorator';
import { TestModel } from './hello-world-repository';

export interface GetHelloWorldProps {
  uuid: string;
  correlationUuid: string;
}

export interface GetHelloWorldResult {
  count: number;
}

export class GetHelloWorldQuery
  implements IQuery<GetHelloWorldProps, 'GetHelloWorld'>
{
  type = 'GetHelloWorld' as const;
  constructor(public readonly payload: GetHelloWorldProps) {}
}

@QueryHandler({ query: GetHelloWorldQuery })
export class GetHelloWorldQueryHandler
  implements IQueryHandler<GetHelloWorldQuery, GetHelloWorldResult | undefined>
{
  execute = async (
    query: GetHelloWorldQuery
  ): Promise<GetHelloWorldResult | undefined> => {
    const doc = await TestModel.findOne({
      uuid: query.payload.uuid,
    }).sort({ startEventPosition: -1 });

    return doc?.state;
  };
}
