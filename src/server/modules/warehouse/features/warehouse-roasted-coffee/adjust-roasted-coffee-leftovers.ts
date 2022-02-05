import { EntityNotFoundError } from '../../../common/errors';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '../../../cqrs/decorators/command-handler.decorator';
import { WarehouseContext } from '../../context/warehouse-roasted-coffee-context';
import { AdjustRoastedCoffeeLeftoversProps } from '../warehouse-roasted-coffee-features';

export class AdjustRoastedCoffeeLeftoversCommand
  implements
    ICommand<AdjustRoastedCoffeeLeftoversProps, 'AdjustRoastedCoffeeLeftovers'>
{
  type = 'AdjustRoastedCoffeeLeftovers' as const;
  constructor(public readonly payload: AdjustRoastedCoffeeLeftoversProps) {}
}

@CommandHandler({ command: AdjustRoastedCoffeeLeftoversCommand })
export class AdjustRoastedCoffeeLeftoversCommandHandler
  implements ICommandHandler<AdjustRoastedCoffeeLeftoversCommand>
{
  constructor(private readonly context: WarehouseContext) {}

  execute = (command: AdjustRoastedCoffeeLeftoversCommand): Promise<void> =>
    this.context.handleWork(async ({ repository, factory }) => {
      try {
        const root = await repository.get(command.payload.roastedCoffeeId);
        root.adjustLeftovers(command.payload);
      } catch (e) {
        if (e instanceof EntityNotFoundError) {
          const root = factory.create(command.payload.roastedCoffeeId);
          root.adjustLeftovers(command.payload);
        } else {
          throw e;
        }
      }
    }, command.payload.correlationUuid);
}
