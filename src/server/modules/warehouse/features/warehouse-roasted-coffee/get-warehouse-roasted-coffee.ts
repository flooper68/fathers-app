import {
  IQuery,
  QueryHandler,
  IQueryHandler,
} from '../../../cqrs/decorators/query-handler.decorator';
import {
  GetWarehouseRoastedCoffeeProps,
  GetWarehouseRoastedCoffeeResult,
} from '../warehouse-roasted-coffee-features';
import { WarehouseRoastedCoffeeProjection } from './warehouse-roasted-coffee-projection';

export class GetWarehouseRoastedCoffeeQuery
  implements
    IQuery<GetWarehouseRoastedCoffeeProps, 'GetWarehouseRoastedCoffee'>
{
  type = 'GetWarehouseRoastedCoffee' as const;
  constructor(public readonly payload: GetWarehouseRoastedCoffeeProps) {}
}

@QueryHandler({ query: GetWarehouseRoastedCoffeeQuery })
export class GetWarehouseRoastedCoffeeQueryHandler
  implements
    IQueryHandler<
      GetWarehouseRoastedCoffeeQuery,
      GetWarehouseRoastedCoffeeResult | undefined
    >
{
  constructor(private readonly projection: WarehouseRoastedCoffeeProjection) {}

  execute = async (
    query: GetWarehouseRoastedCoffeeQuery
  ): Promise<GetWarehouseRoastedCoffeeResult | undefined> => {
    const doc = await this.projection.model.findOne({
      _id: query.payload.id,
    });

    if (!doc) {
      return undefined;
    }

    const object = doc.toObject();

    return object.state;
  };
}
