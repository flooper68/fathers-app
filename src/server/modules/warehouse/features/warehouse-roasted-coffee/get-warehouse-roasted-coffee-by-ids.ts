import {
  IQuery,
  QueryHandler,
  IQueryHandler,
} from '../../../cqrs/decorators/query-handler.decorator';
import {
  GetWarehouseRoastedCoffeeByIdsProps,
  GetWarehouseRoastedCoffeeByIdsResult,
} from '../warehouse-roasted-coffee-features';
import { WarehouseRoastedCoffeeProjection } from './warehouse-roasted-coffee-projection';

export class GetWarehouseRoastedCoffeeByIdsQuery
  implements
    IQuery<
      GetWarehouseRoastedCoffeeByIdsProps,
      'GetWarehouseRoastedCoffeeByIds'
    >
{
  type = 'GetWarehouseRoastedCoffeeByIds' as const;
  constructor(public readonly payload: GetWarehouseRoastedCoffeeByIdsProps) {}
}

@QueryHandler({ query: GetWarehouseRoastedCoffeeByIdsQuery })
export class GetWarehouseRoastedCoffeeByIdsQueryHandler
  implements
    IQueryHandler<
      GetWarehouseRoastedCoffeeByIdsQuery,
      GetWarehouseRoastedCoffeeByIdsResult
    >
{
  constructor(private readonly projection: WarehouseRoastedCoffeeProjection) {}

  execute = async (
    query: GetWarehouseRoastedCoffeeByIdsQuery
  ): Promise<GetWarehouseRoastedCoffeeByIdsResult> => {
    const coffess = await this.projection.model.find({
      id: { $in: query.payload.ids },
    });

    return {
      coffees: coffess.map((doc) => doc.toObject().state),
    };
  };
}
