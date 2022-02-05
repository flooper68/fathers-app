import {
  IQuery,
  QueryHandler,
  IQueryHandler,
} from '../../../cqrs/decorators/query-handler.decorator';
import { warehouseRoastedCoffeeModel } from '../../context/warehouse-roasted-coffee-model';
import { GetRoastedCoffeeHistoryProps } from '../warehouse-roasted-coffee-features';

export class GetRoastedCoffeeQuery
  implements IQuery<GetRoastedCoffeeHistoryProps, 'GetRoastedCoffee'>
{
  type = 'GetRoastedCoffee' as const;
  constructor(public readonly payload: GetRoastedCoffeeHistoryProps) {}
}

@QueryHandler({ query: GetRoastedCoffeeQuery })
// TODO add Result type
export class GetRoastedCoffeeQueryHandler
  implements IQueryHandler<GetRoastedCoffeeQuery, any>
{
  execute = async (query: GetRoastedCoffeeQuery): Promise<any> => {
    const doc = await warehouseRoastedCoffeeModel.findOne({
      uuid: query.payload.roastedCoffeeId,
    });

    if (!doc) {
      return undefined;
    }

    const object = doc.toObject();

    return {
      state: object.state,
      events: object.events,
    };
  };
}
