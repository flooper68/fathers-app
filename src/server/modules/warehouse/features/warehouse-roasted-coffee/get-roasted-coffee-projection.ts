import {
  IQuery,
  QueryHandler,
  IQueryHandler,
} from '../../../cqrs/decorators/query-handler.decorator';
import { GetRoastedCoffeeHistoryProps } from '../warehouse-roasted-coffee-features';
import { WarehouseRoastedCoffeeProjection } from './warehouse-roasted-coffee-projection';

export class GetRoastedCoffeeProjectionQuery
  implements IQuery<GetRoastedCoffeeHistoryProps, 'GetRoastedCoffeeProjection'>
{
  type = 'GetRoastedCoffeeProjection' as const;
  constructor(public readonly payload: GetRoastedCoffeeHistoryProps) {}
}

// TODO add Result type
@QueryHandler({ query: GetRoastedCoffeeProjectionQuery })
export class GetRoastedCoffeeProjectionQueryHandler
  implements IQueryHandler<GetRoastedCoffeeProjectionQuery, any>
{
  constructor(private readonly projection: WarehouseRoastedCoffeeProjection) {}

  execute = async (query: GetRoastedCoffeeProjectionQuery): Promise<any> => {
    const doc = await this.projection.model.findOne({
      _id: query.payload.roastedCoffeeId,
    });

    if (!doc) {
      return undefined;
    }

    const object = doc.toObject();

    return object;
  };
}
