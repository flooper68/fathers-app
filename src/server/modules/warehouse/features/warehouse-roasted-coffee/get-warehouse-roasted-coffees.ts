import {
  IQuery,
  QueryHandler,
  IQueryHandler,
} from '../../../cqrs/decorators/query-handler.decorator';
import {
  GetWarehouseRoastedCoffeesProps,
  GetWarehouseRoastedCoffeesResult,
} from '../warehouse-roasted-coffee-features';
import { WarehouseRoastedCoffeeProjection } from './warehouse-roasted-coffee-projection';

export class GetWarehouseRoastedCoffeesQuery
  implements
    IQuery<GetWarehouseRoastedCoffeesProps, 'GetWarehouseRoastedCoffees'>
{
  type = 'GetWarehouseRoastedCoffees' as const;
  constructor(public readonly payload: GetWarehouseRoastedCoffeesProps) {}
}

@QueryHandler({ query: GetWarehouseRoastedCoffeesQuery })
export class GetWarehouseRoastedCoffeesQueryHandler
  implements
    IQueryHandler<
      GetWarehouseRoastedCoffeesQuery,
      GetWarehouseRoastedCoffeesResult
    >
{
  constructor(private readonly projection: WarehouseRoastedCoffeeProjection) {}

  execute = async (): Promise<GetWarehouseRoastedCoffeesResult> => {
    const coffess = await this.projection.model.find();

    return coffess.map((doc) => doc.toObject().state);
  };
}
