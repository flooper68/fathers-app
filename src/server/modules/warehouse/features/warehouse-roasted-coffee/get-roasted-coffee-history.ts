import {
  IQuery,
  QueryHandler,
  IQueryHandler,
} from '../../../cqrs/decorators/query-handler.decorator';
import { warehouseRoastedCoffeeModel } from '../../context/warehouse-roasted-coffee-model';
import {
  GetRoastedCoffeeHistoryProps,
  GetRoastedCoffeeHistoryResult,
} from '../warehouse-roasted-coffee-features';

export class GetRoastedCoffeeQuery
  implements IQuery<GetRoastedCoffeeHistoryProps, 'GetRoastedCoffee'>
{
  type = 'GetRoastedCoffee' as const;
  constructor(public readonly payload: GetRoastedCoffeeHistoryProps) {}
}

@QueryHandler({ query: GetRoastedCoffeeQuery })
export class GetRoastedCoffeeQueryHandler
  implements
    IQueryHandler<GetRoastedCoffeeQuery, GetRoastedCoffeeHistoryResult>
{
  execute = async (
    query: GetRoastedCoffeeQuery
  ): Promise<GetRoastedCoffeeHistoryResult> => {
    const doc = await warehouseRoastedCoffeeModel.findOne({
      uuid: query.payload.roastedCoffeeId,
    });

    if (!doc) {
      return { events: [] };
    }

    const object = doc.toObject();

    return {
      events: object.events,
    };
  };
}
