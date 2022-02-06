import { RoastingContext } from '../../context/roasting-context';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
} from '../../../cqrs/decorators/command-handler.decorator';
import { AddRoastedCoffeeProps } from '../roasting-settings-feature';

export class AddRoastedCoffeeCommand
  implements ICommand<AddRoastedCoffeeProps, 'AddRoastedCoffee'>
{
  type = 'AddRoastedCoffee' as const;
  constructor(public readonly payload: AddRoastedCoffeeProps) {}
}

@CommandHandler({ command: AddRoastedCoffeeCommand })
export class AddRoastedCoffeeCommandHandler
  implements ICommandHandler<AddRoastedCoffeeCommand>
{
  constructor(private readonly context: RoastingContext) {}

  execute = (command: AddRoastedCoffeeCommand): Promise<void> =>
    this.context.handleWork(async ({ repository }) => {
      const root = await repository.get();
      root.addRoastedCoffee(command.payload);
    }, command.payload.correlationUuid);
}
