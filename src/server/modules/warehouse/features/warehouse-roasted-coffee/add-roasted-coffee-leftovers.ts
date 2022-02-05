import { EntityNotFoundError } from './../../../common/errors';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '../../../cqrs/decorators/command-handler.decorator';
import { WarehouseContext } from '../../context/warehouse-roasted-coffee-context';
import { AddRoastingLeftoversProps } from '../warehouse-roasted-coffee-features';

export class AddRoastedCoffeeLeftoversCommand
  implements ICommand<AddRoastingLeftoversProps, 'AddRoastedCoffeeLeftovers'>
{
  type = 'AddRoastedCoffeeLeftovers' as const;
  constructor(public readonly payload: AddRoastingLeftoversProps) {}
}

@CommandHandler({ command: AddRoastedCoffeeLeftoversCommand })
export class AddRoastedCoffeeLeftoversCommandHandler
  implements ICommandHandler<AddRoastedCoffeeLeftoversCommand>
{
  constructor(private readonly context: WarehouseContext) {}

  execute = (command: AddRoastedCoffeeLeftoversCommand): Promise<void> =>
    this.context.handleWork(async ({ repository, factory }) => {
      try {
        const root = await repository.get(command.payload.roastedCoffeeId);
        root.addLeftovers(command.payload);
      } catch (e) {
        if (e instanceof EntityNotFoundError) {
          const root = factory.create(command.payload.roastedCoffeeId);
          root.addLeftovers(command.payload);
        } else {
          throw e;
        }
      }
    }, command.payload.correlationUuid);
}
