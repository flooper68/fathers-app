import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '../../../cqrs/decorators/command-handler.decorator';
import { WarehouseContext } from '../../context/warehouse-roasted-coffee-context';
import { UseRoastedCoffeeLeftoversProps } from '../warehouse-roasted-coffee-features';

export class UseRoastedCoffeeLeftoversCommand
  implements
    ICommand<UseRoastedCoffeeLeftoversProps, 'UseRoastedCoffeeLeftovers'>
{
  type = 'UseRoastedCoffeeLeftovers' as const;
  constructor(public readonly payload: UseRoastedCoffeeLeftoversProps) {}
}

@CommandHandler({ command: UseRoastedCoffeeLeftoversCommand })
export class UseRoastedCoffeeLeftoversCommandHandler
  implements ICommandHandler<UseRoastedCoffeeLeftoversCommand>
{
  constructor(private readonly context: WarehouseContext) {}

  execute = (command: UseRoastedCoffeeLeftoversCommand): Promise<void> =>
    this.context.handleWork(async ({ repository }) => {
      const root = await repository.get(command.payload.roastedCoffeeId);
      root.useLeftovers(command.payload);
    }, command.payload.correlationUuid);
}
