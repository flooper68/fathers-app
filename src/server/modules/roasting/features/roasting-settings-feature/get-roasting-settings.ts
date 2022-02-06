import {
  IQuery,
  QueryHandler,
  IQueryHandler,
} from '../../../cqrs/decorators/query-handler.decorator';
import { roastingSettingsModel } from '../../context/roasting-settings-model';
import {
  GetRoastingSettingsProps,
  GetRoastingSettingsResult,
} from '../roasting-settings-feature';

export class GetRoastingSettingsQuery
  implements IQuery<GetRoastingSettingsProps, 'GetRoastingSettings'>
{
  type = 'GetRoastingSettings' as const;
  constructor(public readonly payload: GetRoastingSettingsProps) {}
}

@QueryHandler({ query: GetRoastingSettingsQuery })
export class GetRoastingSettingsQueryHandler
  implements IQueryHandler<GetRoastingSettingsQuery, GetRoastingSettingsResult>
{
  execute = async (): Promise<GetRoastingSettingsResult> => {
    const doc = await roastingSettingsModel.findOne();

    if (!doc) {
      return {
        roastedCoffees: [],
        greenCoffees: [],
        productVariations: [],
      };
    }

    const object = doc.toObject();

    return object.state;
  };
}
